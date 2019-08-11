class Task {
  constructor(name, type, time) {
    const types = ['once', 'repeat'];
    if (!name) {
      throw new Error('Missing task name.');
    }
    if (!types.includes(type)) {
      throw new Error('Invalid task type. Use "once" or "repeat".');
    }
    if (!time) {
      throw new Error('You must set a task time.');
    }

    this.name = name;
    // Once or Reocurring
    this.type = type;
    // Cron or Date
    this.time = time;
  }

  toString() {
    return `${this.name} (${this.type}) - ${this.time}`;
  }
}

module.exports = Task;
