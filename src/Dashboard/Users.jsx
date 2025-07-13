import React, { useEffect, useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreVertical,
    UserCheck,
    UserX,
    Mail,
    Link
} from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import SignUp from '../Auth/SignUp';


const AllUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const navigate = useNavigate();

    const filteredUsers = Array.isArray(users)
        ? users.filter(user => {
            const matchesSearch =
                user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
            const isNotExcludedUser = user.id !== 13;
            return matchesSearch && matchesFilter && isNotExcludedUser;
        })
        : [];


    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    // const getStatusBadge = (status) => {
    //     switch (status) {
    //         case 'active':
    //             return <span className="badge bg-success-subtle text-success">Active</span>;
    //         case 'inactive':
    //             return <span className="badge bg-warning-subtle text-warning">Inactive</span>;
    //         case 'banned':
    //             return <span className="badge bg-danger-subtle text-danger">Banned</span>;
    //         default:
    //             return <span className="badge bg-secondary-subtle text-secondary">Free Plan</span>;
    //     }
    // };

    const getStatusIcon = (status) => {
        switch (status) {
            // case 'active':
            //     return <UserCheck size={16} className="text-success" />;
            // case 'inactive':
            //     return <UserX size={16} className="text-warning" />;
            // case 'banned':
            //     return <UserX size={16} className="text-danger" />;
            default:
                return <Users size={16} className="text-muted" />;
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/getAllUsers`); // change this to 
                setUsers(response?.data?.data); // assuming response.data is an array of users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const token = localStorage.getItem('token');

    const handleDeleteConfirmed = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (!confirmed) return;

            const response = await axios.delete(`${BASE_URL}/user/deleteUserById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('Account deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            alert('An error occurred while deleting the account.');
        }
    };

    const exportToExcel = () => {
        const exportData = filteredUsers.map(user => ({
            Name: user.full_name,
            Email: user.email,
            Status: user.status,
            Joined: new Date(user.created_at).toLocaleDateString(),
            LastActive: new Date(user.created_at).toLocaleDateString(),
            ChatCount: user.chatCount
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "users_list.xlsx");
    };


    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">All Users</h1>
                    <p className="text-muted mb-0">Manage and monitor user accounts</p>
                </div>
                <div className="d-flex gap-2">
                    {/* <button className="btn btn-outline-primary">
                        <Download size={16} className="me-2" />
                        Export Users
                    </button> */}
                    <button className="btn btn-outline-primary" onClick={exportToExcel}>
                        <Download size={16} className="me-2" />
                        Export Users
                    </button>

                    {/* <button className="btn btn-primary">
                        <Plus size={16} className="me-2" />
                        Add User
                    </button> */}
                    <button className="btn btn-primary" onClick={() => setShowSignupModal(true)}>
                        <Plus size={16} className="me-2" />
                        Add User
                    </button>

                </div>
            </div>
            {showSignupModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New User</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSignupModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <SignUp onClose={() => setShowSignupModal(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <Users size={24} className="text-primary mb-2" />
                            <h4 className="mb-1">{users.length}</h4>
                            <small className="text-muted">Total Users</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <UserCheck size={24} className="text-success mb-2" />
                            <h4 className="mb-1">{users.filter(u => u.status === 'active').length}</h4>
                            <small className="text-muted">Active Users</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <UserX size={24} className="text-warning mb-2" />
                            <h4 className="mb-1">{users.filter(u => u.status === 'inactive').length}</h4>
                            <small className="text-muted">Inactive Users</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <UserX size={24} className="text-danger mb-2" />
                            <h4 className="mb-1">{users.filter(u => u.status === 'banned').length}</h4>
                            <small className="text-muted">Banned Users</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Search size={16} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="banned">Banned</option>
                            </select>
                        </div>
                        {/* <div className="col-md-3">
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary">
                                    <Filter size={16} className="me-2" />
                                    More Filters
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                        Users List ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 fw-semibold">User</th>
                                    <th className="border-0 fw-semibold">Current Plan</th>
                                    <th className="border-0 fw-semibold">Joined</th>
                                    <th className="border-0 fw-semibold">Last Active</th>
                                    <th className="border-0 fw-semibold">Chat Count</th>
                                    <th className="border-0 fw-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id} >
                                        <td onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/dashboard/updateprofile', { state: { userData: user } });
                                        }}>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{ width: '40px', height: '40px' }}>
                                                    <span className="text-white fw-bold">
                                                        {user.full_name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="fw-medium">{user.full_name}</div>
                                                    <small className="text-muted">{user.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {getStatusIcon(user.status)}
                                                <span className="ms-2">{user?.plan}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted">
                                            {new Date(user.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="text-muted">
                                            {new Date(user.lastActive).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="badge bg-info-subtle text-info">{user.chatCount}</span>
                                        </td>
                                        <td>
                                            {/* <div className="dropdown"> */}
                                            <div className="d-flex">
                                                {/* <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    type="button"
                                                // data-bs-toggle="dropdown"
                                                > */}
                                                {/* <MoreVertical size={16} /> */}
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate('/dashboard/updateprofile', { state: { userData: user } });
                                                    }}
                                                >
                                                    <Eye size={16} className="me-2" />
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate('/dashboard/updateprofile', { state: { userData: user } });
                                                    }}
                                                >
                                                    <Edit size={16} className="me-2" />
                                                </a>
                                                <a
                                                    className="dropdown-item text-danger"
                                                    href="#"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#deleteUserModal"
                                                    onClick={() => setSelectedUserId(user.id)}
                                                >
                                                    <Trash2 size={16} className="me-2" />
                                                </a>

                                                {/* </button> */}
                                                {/* <ul className="dropdown-menu">
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            <Eye size={16} className="me-2" />
                                                            View Details
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            <Mail size={16} className="me-2" />
                                                            Send Message
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item" href="#">
                                                            <Edit size={16} className="me-2" />
                                                            Edit User
                                                        </a>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <a className="dropdown-item text-danger" href="#">
                                                            <Trash2 size={16} className="me-2" />
                                                            Delete User
                                                        </a>
                                                    </li>
                                                </ul> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Showing {filteredUsers.length ? startIndex + 1 : 0} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                    </small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li
                                    key={page}
                                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Deletion</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this user?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteConfirmed(selectedUserId)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AllUsers;
