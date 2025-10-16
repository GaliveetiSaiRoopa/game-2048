import React, { useEffect } from "react";
import closeIcon from "../assets/Close.svg";

const HasAnyMovesLeft = ({ open, handleClose, handleRestart }) => {
  const onClickClose = () => {
    handleClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  return (
    <div className="modal-state" onClick={onClickClose}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <div className="header-modal">
          <p className=""></p>
          <img
            src={closeIcon}
            alt="close-icon"
            className="cursor-pointer"
            onClick={onClickClose}
          />
        </div>
        <div className="body-modal">
          <div className="modal-text">No more moves are possible</div>
           <button className="" onClick={() => handleRestart()}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default HasAnyMovesLeft;
