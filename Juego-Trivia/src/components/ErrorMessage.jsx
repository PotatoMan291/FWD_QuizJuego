function ErrorMessage({ message }) {
  return (
    <div className="status-card error-card">
      <h3>Ocurrió un error</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;