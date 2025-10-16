import React, { useEffect } from "react";


const HasAnyMovesLeft = ({ open, handleClose, handleRestart }) => {
  if (!open) return;
  const onClickClose = () => {
    handleClose();
  };

  const handleRestartGame = () => {
    handleRestart();
    onClickClose();
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
            src="/assets/Close.svg"
            alt="close-icon"
            className="cursor-pointer"
            onClick={onClickClose}
          />
        </div>
        <div className="body-modal">
          <div className="modal-text">No more moves are possible</div>
          <button className="" onClick={handleRestartGame}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default HasAnyMovesLeft;
