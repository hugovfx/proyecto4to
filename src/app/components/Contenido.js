import "./Contenido.css";

function Contenido() {
  return (
    <div className="content">
      <div className="divM">
        <div className="divN">
           <div className="image">
            <img 
            src="/hacked.jpg"
            className="img"
            />
           </div>
           <div className="textimage"></div>  
        </div>
        <div className="divN">
        <div className="image">
        <img 
            src="/shodan-web.png"
            className="img"
            />
        </div>
        <div className="textimage">
          <p className="detailsText">Encuentra informacion de un sitio web como subdominios etc</p>
          </div>  
        </div>
      </div>
      <div className="divM">
        <div className="divN">
        <div className="image">
        <img 
            src="/nmap.jpg"
            className="img"
            />
        </div>
        <div className="textimage"></div>  
        </div>
        <div className="divN">
        <div className="image">
        <img 
            src="/images.png"
            className="img"
            />  
        </div>
        <div className="textimage"></div>  
        </div>
      </div>
    </div>
  );
}

export default Contenido;
