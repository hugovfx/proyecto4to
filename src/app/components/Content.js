import "./Content.css";

function Content({info, name}) {
  return (
    <div className="content">
      <div className="divM">
        <div className="divN">
           <h1>{name}</h1>
           <p style={{textAlign: "justify"}}>{info}</p>
        </div>
      </div>
    </div>
  );
}

export default Content;
