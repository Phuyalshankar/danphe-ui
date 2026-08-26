'use strict';

/**
 * 🌊 Dolphin Native — Official Bootstrap UI Component Bridge
 * Lightweight zero-dependency bridge mapping Bootstrap UI React components
 * directly to Native Android Views (Mobile) and Semantic HTML5 (Web).
 */

const Container = (props) => (
    <div className={`container ${props.fluid ? 'container-fluid' : ''} ${props.className || ''}`}>
        {props.children}
    </div>
);

const Row = (props) => (
    <div className={`row ${props.className || ''}`}>
        {props.children}
    </div>
);

const Col = (props) => {
    const colClass = props.xs ? `col-${props.xs}` : (props.md ? `col-md-${props.md}` : 'col');
    return (
        <div className={`${colClass} ${props.className || ''}`}>
            {props.children}
        </div>
    );
};

const Card = (props) => (
    <div className={`card shadow-sm ${props.className || ''}`}>
        {props.children}
    </div>
);

Card.Body = (props) => (
    <div className={`card-body ${props.className || ''}`}>
        {props.children}
    </div>
);

Card.Title = (props) => (
    <h5 className={`card-title font-bold ${props.className || ''}`}>
        {props.children}
    </h5>
);

const Button = (props) => {
    const variant = props.variant || 'primary';
    const size = props.size ? `btn-${props.size}` : '';
    return (
        <button action={props.action || props.onClick} className={`btn btn-${variant} ${size} ${props.className || ''}`}>
            {props.children}
        </button>
    );
};

const Table = (props) => (
    <div className="table-responsive">
        <table className={`table ${props.striped ? 'table-striped' : ''} ${props.hover ? 'table-hover' : ''} ${props.bordered ? 'table-bordered' : ''} ${props.className || ''}`}>
            {props.children}
        </table>
    </div>
);

const Form = (props) => (
    <form onSubmit={props.onSubmit} className={`${props.className || ''}`}>
        {props.children}
    </form>
);

Form.Group = (props) => (
    <div className={`mb-3 ${props.className || ''}`}>
        {props.children}
    </div>
);

Form.Label = (props) => (
    <label className={`form-label ${props.className || ''}`}>
        {props.children}
    </label>
);

Form.Control = (props) => (
    <input 
        type={props.type || 'text'} 
        placeholder={props.placeholder} 
        value={props.value} 
        className={`form-control ${props.className || ''}`} 
    />
);

const Navbar = (props) => (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark px-3 ${props.className || ''}`}>
        {props.children}
    </nav>
);

Navbar.Brand = (props) => (
    <a className={`navbar-brand font-bold ${props.className || ''}`} href={props.href || '#'}>
        {props.children}
    </a>
);

module.exports = {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form,
    Navbar
};
