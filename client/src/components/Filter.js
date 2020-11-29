import React, { useContext, useRef, useEffect } from "react";
import MailContext from "../context/MailContext/mailContext";

const Filter = () => {
  const mailContext = useContext(MailContext);
  const text = useRef("");

  const { filterLetters, clearFilter, filtered } = mailContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = "";
    }
  });

  const onChange = (e) => {
    if (text.current.value !== "") {
      filterLetters(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Direct Mail Library'
        onChange={onChange}
      />
    </form>
  );
};

export default Filter;
