import "./Content.css";

function Content({ info, name }) {
  return (
    <div className="content">
      <div className="divM">
        <div className="divN">
          <h1>{name}</h1>
          {typeof info === "string" ? (
            <p style={{ textAlign: "justify" }}>{info}</p>
          ) : (
            <div style={{ textAlign: "justify" }}>{info}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Content;
