import React, { useEffect, useState } from 'react'

export const Todo = () => {

    const [title, setTitle] = useState("");
    const [description, setDicription] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(-1)
    const [error, setEroor] = useState("");
    const [message, setMessage] = useState("");
    const [editTitle, seteditTitle] = useState("");
    const [editDescription, seteditDescription] = useState("")


    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("API URL =", apiUrl);


    const handleSubmit = () => {
        setEroor("")

        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }])
                    setMessage("Item add SuccessFull")


                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                } else {
                    setEroor("Unable to create Todo item")
                    setMessage("")
                }


            })
                .catch(() => {
                    setEroor("Unable to create Todo item")
                    setMessage("")
                })

        } else {
            setEroor("Plsee Fill the fieslds")
            setMessage("")
        }
    }

    useEffect(() => {
        getItems()
    }, [])
    const getItems = (() => {
        fetch(apiUrl + "/getAll")
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setTodos(res)
            })
    })
    const handleEdit = (item) => {
        setEditId(item._id);
        seteditTitle(item.title);
        seteditDescription(item.description)
        return item;
    }
    const handleUpdate = () => {

        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/update/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                
                if (res.ok) {
                      const updateTodo = todos.map((item)=>{
                        if(item._id == editId){
                            return {
                                ...item,
                                title:editTitle,
                                      description:editDescription
                        }
                    } return item
                      })
                    setTodos(updateTodo)
                    setMessage("Item add SuccessFull")


                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                    setEditId(-1)
                } else {
                    setEroor("Unable to create Todo item")
                    setMessage("")
                }


            })
                .catch(() => {
                    setEroor("Unable to create Todo item")
                    setMessage("")
                })

        } else {
            setEroor("Plsee Fill the fieslds")
            setMessage("")
        }

    }

    const handleEditCancel = () => {
        setEditId(-1)
    }

    const handleDelete=(id)=>{
        if(window.confirm("Are You Sure want to delete")){
            fetch(apiUrl+"/delete/"+id,{
            method:"DELETE"
        }
    ).then(()=>{
        const updatedTodos=todos.filter((item)=>item._id!==id)
        setTodos(updatedTodos)
    })

        }
          
    }

    return (
        <>
            <div className=" text-center bg-success text-light">
                <h1>Todo Project With Mern</h1>
            </div>

            <div className="container ms-3">
                <h3>Add Item</h3>
                {message && <p className='text-success' >{message}</p>}
                <div className='form-group d-flex gap-2'>
                    <input className='form-control' onChange={(e) => setTitle(e.target.value)} placeholder='title' type="text" value={title} />
                    <input className='form-control' onChange={(e) => setDicription(e.target.value)} placeholder='description' type="text" value={description} />
                    <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
                </div>

                {error && <p className='text-danger'>{error}</p>}

            </div>

            <div className=' w-50 ms-5 mt-5 '>
                Task
                <div className='list-group mt-3'>
                    {
                        todos.map((item) => <li className='list-group-item bg-info d-flex justify-content-between my-2'>
                            <div className='d-flex flex-column'>
                                {
                                    editId == -1 || editId !== item._id ? <>
                                        <span className='fw-bold'>{item.title}</span>
                                        <span>{item.description}</span></> :
                                        <div className='form-group d-flex gap-2'>
                                            <input className='form-control' onChange={(e) => seteditTitle(e.target.value)} placeholder='title' type="text" value={editTitle} />
                                            <input className='form-control' onChange={(e) => seteditDescription(e.target.value)} placeholder='description' type="text" value={editDescription} />
                                        </div>
                                }
                            </div>

                            <div className='d-flex gap-2'>
                                {
                                    editId == -1 || editId !== item._id ? <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={(handleUpdate)}>Update</button>
                                }
                                {editId == -1 || editId !== item._id ? <button className='btn btn-danger' onClick={()=> handleDelete(item._id)}>Delete</button> :
                                    <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}
                            </div>

                        </li>)
                    }



                </div>
            </div>

        </>
    )
}
