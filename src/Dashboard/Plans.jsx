import React, { useState, useEffect } from "react";
import { Pencil, Save, X, Trash } from "lucide-react";
import BASE_URL from "../../config";

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [newPlan, setNewPlan] = useState({ plan_name: "", 
        price: "", 
         daily_limit: "" ,
        duration: "Monthly", 
        description: "" 
    });
    const [isModalOpen, setModalOpen] = useState(false);

//  console.log( "EDiting Id" , editingId)

    useEffect(() => {
        fetchPlans();
    }, []);

    
    const fetchPlans = async () => {
        try {
            const response = await fetch(`${BASE_URL}/plan/subscription-plans`);
            const data = await response.json();

            // Sort plans by id in ascending order
            const sortedData = data.sort((a, b) => a.id - b.id);

            setPlans(sortedData);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };


    const handleEditClick = (plan) => {
        setEditingId(plan.id);
        setEditData({ ...plan });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleNewPlanChange = (e) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`${BASE_URL}/plan/subscription-plan/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) {
                throw new Error('Failed to update plan');
            }

            const updatedPlan = await response.json();

            setPlans((prevPlans) =>
                prevPlans.map((plan) =>
                    plan.id === editingId ? updatedPlan : plan
                )
            );

            handleCancel();
            alert("Plan updated successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Error updating plan");
        }
    };

    const handleAddPlan = async () => {
        try {
            const response = await fetch(`${BASE_URL}/plan/create-subscription-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlan),
            });

            if (!response.ok) {
                throw new Error('Failed to create new plan');
            }

            const newPlanData = await response.json();
            setPlans([...plans, newPlanData]);
            setNewPlan({ plan_name: "", price: "", duration: "Monthly", description: "" });
            setModalOpen(false);
            alert("New plan added successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error adding plan:", error);
        }
    };

    const handleDeletePlan = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/plan/subscription-plan/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete plan');
            }

            setPlans(plans.filter((plan) => plan.id !== id));
            alert("Plan deleted successfully");
        } catch (error) {
            console.error("Error deleting plan:", error);
        }
    };

    return (
        <div className="container my-5">
            <h3 className="fw-bold text-center mb-4">Manage Subscription Plans</h3>
            <div className="d-flex justify-content-end mb-4">
                {/* <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    Add New Plan
                </button> */}
            </div>
            {/* Modal for Adding New Plan */}
            {isModalOpen && (
                <div className="modal fade show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Plan</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalOpen(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    name="plan_name"
                                    value={newPlan.plan_name}
                                    onChange={handleNewPlanChange}
                                    placeholder="Plan Name"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    name="price"
                                    value={newPlan.price}
                                    onChange={handleNewPlanChange}
                                    placeholder="Price"
                                />

                                <input
    type="text"
    className="form-control mb-2"
    name="daily_limit"
    value={newPlan.daily_limit}
    onChange={handleNewPlanChange}
    placeholder="Daily Limit (Number of Uses)"
/>

                                <select
                                    className="form-select mb-2"
                                    name="duration"
                                    value={newPlan.duration}
                                    onChange={handleNewPlanChange}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>

                                

                                <textarea
                                    className="form-control mb-2"
                                    name="description"
                                    value={newPlan.description}
                                    onChange={handleNewPlanChange}
                                    placeholder="Features"
                                    rows={2}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                                    Close
                                </button>
                                <button className="btn btn-success" onClick={handleAddPlan}>
                                    Add Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4">
                {plans.map((plan) => (
                    <div className="col-md-4" key={plan.id}>
                        <div className="card shadow border-0 h-100" style={{ borderRadius: "15px" }}>
                            <div className="card-body d-flex flex-column border rounded">
                                {editingId === plan.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            name="plan_name"
                                            value={editData.plan_name}
                                            onChange={handleChange}
                                            placeholder="Plan Name"
                                        />
                                        <input
                                            type="number"
                                            className="form-control mb-2"
                                            name="price"
                                            value={editData.price}
                                            onChange={handleChange}
                                            placeholder="Price"
                                        />
                                        <input
    type="text"
    className="form-control mb-2"
    name="daily_limit"
    value={editData.daily_limit}
    onChange={handleChange}
    placeholder="Daily Limit"
/>
                                        <select
                                            className="form-select mb-2"
                                            name="duration"
                                            value={editData.duration}
                                            onChange={handleChange}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                        <textarea
                                            className="form-control mb-2"
                                            name="description"
                                            value={editData.description}
                                            onChange={handleChange}
                                            placeholder="Features"
                                            rows={2}
                                        />
                                        <div className="d-flex justify-content-end gap-2 mt-auto">
                                            <button className="btn btn-outline-secondary" onClick={handleCancel}>
                                                <X size={14} /> Cancel
                                            </button>
                                            <button className="btn btn-success" onClick={handleUpdate}>
                                                <Save size={14} className="me-1" />
                                                Save
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <h5 className="fw-bold mb-0 text-primary">{plan.plan_name}</h5>
                                            {/* <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeletePlan(plan.id)}
                                            >
                                                <Trash size={14} />
                                            </button> */}
                                        </div>
                                        <h4 className="text-dark">${plan.price}</h4>
                                        <p className="text-muted mb-1">Duration: {plan.duration}</p>
                                          <p className="text-muted mb-1">Chats: {plan?.daily_limit}</p>
                                        <p className="text-muted mb-3">
                                            <strong>Description:</strong> <br />
                                            {plan.description}
                                        </p>
                                        <div className="mt-auto text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleEditClick(plan)}
                                            >
                                                <Pencil size={14} className="me-1" />
                                                Edit
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;