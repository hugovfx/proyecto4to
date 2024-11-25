import "./Contenido.css";
import ButtonLink from "./ButtonLink";

function Contenido() {
  return (
    <div className="content">
      <div className="divM">
        <div className="divN" style={{display:"flex", flexDirection:"column", justifyContent:"space-around"}}>
           <div className="image">
            <img 
            src="/hacked.jpg"
            className="img"
            />
           </div>
            <ButtonLink txt={"Hacked"} href={"/domains-discovery"}/>  
        </div>
        <div className="divN" style={{display:"flex", flexDirection:"column", justifyContent:"space-around"}}>
        <div className="image">
        <img 
            src="/shodan-web.png"
            className="img"
            />
        </div>
        <ButtonLink txt={"Shodan"} href={"/whois"}/>   
        </div>
      </div>
      <div className="divM">
        <div className="divN" style={{display:"flex", flexDirection:"column", justifyContent:"space-around"}}>
        <div className="image">
        <img 
            src="/nmap.jpg"
            className="img"
            />
        </div>
        <ButtonLink txt={"Nmap"} href={"/nmap"}/>  
        </div>
        <div className="divN" style={{display:"flex", flexDirection:"column", justifyContent:"space-around"}}>
        <div className="image">
        <img 
            src="/images.png"
            className="img"
            />  
        </div>
        <ButtonLink txt={"Mac Address"} href={"/mac-address"}/>  
        </div>
      </div>
    </div>
  );
}

export default Contenido;
