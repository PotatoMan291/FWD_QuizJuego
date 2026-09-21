function Loading({ message = "Cargando..." }) {
  return (
    <div className="status-card loading-card">
      <div className="loader"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;