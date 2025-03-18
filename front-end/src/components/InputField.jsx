const InputField = ({ label, type, value, onChange }) => {
    return (
        <div>
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} required />
        </div>
    );
};

export default InputField;
