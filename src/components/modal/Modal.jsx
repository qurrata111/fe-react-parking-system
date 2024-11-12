import React, { useRef } from "react";

export default function Modal({ open, title, onClose, children, width, footer }) {
  const modalRef = useRef(null);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        // height: "100vh",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: width || 500,
          // height: 400,
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{title || ""}</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#333",
            }}
          >
            &times;
          </button>
        </div>
        {/* BODY */}
        <div
          style={{
            padding: 20,
            // height: "calc(100% - 50px)",
            // overflowY: "auto",
          }}
        >
          {children}
        </div>
        {footer &&
          <div
            style={{
              // display: "flex",
              // justifyContent: "space-between",
              // alignItems: "center",
              // padding: "10px 20px",
              // backgroundColor: "#f5f5f5",
              // borderBottom: "1px solid #e0e0e0",
            }}
          >
            {footer}
          </div>}
      </div>
    </div>
  );
}
