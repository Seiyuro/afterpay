import React from "react";

const FieldContainer = ({ label, addFieldValue, fieldsType }) => {
  //Statless Component we dont need to manipulate the state.
  //Tried to make this more re-usable but I think I missed some cases, like phone number, 
  //there should be a way to let this component know if is a input text, password, phone etc.. 
  
  const setValue = evt => {
    //small function that is trigger every time that the user do a on change on the fields
    const values = evt.target;
    addFieldValue(values.value, values.id, fieldsType);
  };
  return (
    <div className="form__container">
      <div className="form__container--column-label">
        <span>{label} :</span>
      </div>
      <div className="form__container--column-middle" />
      <div className="form__container--column-field">
        <input
          className="form__container--input"
          id={label}
          autoComplete="off"
          type="text"
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export default FieldContainer;
