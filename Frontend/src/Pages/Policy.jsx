
import policy from "../Policy.json"


function Policy(){

   

  return (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 20 }}>
  <h1>Manalor Privacy Policy</h1>
  <div style={{ maxWidth: "800px", textAlign: "left" }}>
    {policy.terms.map((paragraph, index) => (
      <p key={index} style={{ marginBottom: "1em" }}>{paragraph}</p>
    ))}
  </div>
</div>


  )

}



export default Policy