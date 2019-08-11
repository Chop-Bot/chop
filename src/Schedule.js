/* eslint global-require: "off" */
const fs = require('fs');
const path = require('path');

const nodeSchedule = require('node-schedule');
const moment = require('moment');

const Task = require('./Task');
const events = require('./events');
const log = require('./config/log');

const getAllFiles = (dir) => {
  const fileExtensionExp = /\.js$/;
  return fs.readdirSync(dir).reduce((files, file) => {
    const currentPath = path.join(dir, file);
    const isDirectory = fs.statSync(currentPath).isDirectory();
    if (isDirectory) {
      return [...files, ...getAllFiles(currentPath)];
    }
    return /^_/.test(file) || !fileExtensionExp.test(file) ? [...files] : [...files, currentPath];
  }, []);
};

class Schedule {
  constructor(client) {
    if (!client) {
      throw new Error('Missing client in the Schedule constructor.');
    }
    this.client = client;
    this.tasks = new Map();
    const requires = getAllFiles(path.join(__dirname, 'tasks')).map(t => require(t.replace(__dirname, './')));
    requires.forEach((NewTask) => {
      if (NewTask instanceof Task || NewTask.prototype instanceof Task) {
        this.create(NewTask);
      }
    });
    events.on('kill', () => {
      log.info('[Schedule] Clearing task jobs.');
      this.tasks.forEach(t => t.job.cancel());
    });
  }

  create(NewTask) {
    const task = new NewTask();
    task.client = this.client;
    if (!task.name) {
      log.warn(`[Schedule] Task${task}does not have a name. Ignoring it.`);
      return;
    }
    let ocurrence;
    if (task.type === 'once') {
      if (!moment(task.time).isAfter(moment())) {
        log.warn('[Schedule] Time for task', task.name, 'already passed. Will not schedule.');
        return;
      }
      ocurrence = moment(task.time).toDate();
    }
    if (task.type === 'repeat') {
      ocurrence = task.time;
    }
    task.job = nodeSchedule.scheduleJob(ocurrence, () => task.run());
    this.tasks.set(task.name, task);
  }

  // delete(taskToDelete) {}
}

module.exports = (client) => {
  if (client.schedule) return;
  // Disablind this rule until I extend Discord.Client
  // eslint-disable-next-line no-param-reassign
  client.schedule = new Schedule(client);
};
