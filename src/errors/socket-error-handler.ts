export const socketErrorHandler = (err: unknown) => {
  console.log("Error occurred in Socket's event:\n", JSON.stringify(err, null, 2));
};
