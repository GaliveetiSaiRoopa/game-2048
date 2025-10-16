import React, { useEffect } from "react";

const HasWon = ({ open, handleClose }) => {
  const onClickClose = () => {
    handleClose();
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [open]);
  return (
    <div
      className="modal-state"
      onClick={onClickClose}
      aria-modal="true"
      aria-labelledby="winMessage"
    >
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <div className="header-modal">
          <p className=""></p>
          <img
            src="/assets/Close.svg"
            alt="close-icon"
            className="cursor-pointer"
            onClick={onClickClose}
          />
        </div>

        <div className="modal-text" id={"winMessage"}>
          Hurry! You won the Game
        </div>
      </div>
    </div>
  );
};

export default HasWon;
