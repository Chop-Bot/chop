async function promptAndHandle(prompt, handle) {
  if (!prompt || !handle) {
    throw new Error('You must pass a prompt and handle function');
  }
  const response = await prompt;
  return handle(response);
}

module.exports = promptAndHandle;
