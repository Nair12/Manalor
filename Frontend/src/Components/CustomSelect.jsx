import { useState } from "react";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { DeleteImage, RenameImage } from "../Redux/ImageSlice";
import { setImageUpdated } from "../Redux/ImageSlice";
import { useNavigate } from "react-router-dom";
import { RemovePhoto } from "../Redux/ImageSlice";


function CustomSelect({guid}) {
  const [show, setShow] = useState(false);

  const [modalName, setModalName] = useState(false)
  const [newNameValue, setNewNameValue] = useState("")



  const [modalDelete, setModalDelete] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleRenameClick = async () => {

    dispatch(RenameImage({guid,newNameValue}))
    setModalName(false)
    dispatch(setImageUpdated(true))
    
  }

  const handleDeleteClick = async ()=>{
    dispatch(DeleteImage(guid))
    dispatch(RemovePhoto(guid))
    
    navigate("/")
      
   

  }



  return (
    <>
      <Dropdown show={show} onToggle={(isOpen) => setShow(isOpen)} style={{ marginTop: "2rem", display: "inline-block" }}>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic-button" style={{ width: "100%", height: "auto" }}>
          Edit
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { setModalName(!modalName); setShow(false);}}>
            <i class="bi bi-arrow-counterclockwise"></i>Rename
          </Dropdown.Item>
          <Dropdown.Item onClick={() => { setModalDelete(!modalDelete); setShow(false); }}>
            <i class="bi bi-trash-fill"></i> Delete
          </Dropdown.Item>
        </Dropdown.Menu>



      </Dropdown>

      {/* Modal Rename */}

      <Modal show={modalName} onHide={() => setModalName(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input value={newNameValue} onChange={(e) => { setNewNameValue(e.target.value) }} style={{ width: "100%", height: "20%" }}></input>
        </Modal.Body>
        <Modal.Footer style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Button variant="secondary" onClick={() => setModalName(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{handleRenameClick()
          }}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Delete */}

      <Modal show={modalDelete} onHide={() => setModalDelete(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#fff3f3' }}>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill"
              style={{ color: "red", marginRight: "0.5rem" }}></i>
            Are you sure you want to delete?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>This action <strong>cannot be undone</strong>.</p>
        </Modal.Body>

        <Modal.Footer style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Button variant="secondary" onClick={() => setModalDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteClick();
              console.log("Deleted!");
              setModalDelete(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>






    </>

  );
}

export default CustomSelect;
