import { useEffect, useRef } from "react";
import gsap from "gsap";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current || !modalRef.current) return;

    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      gsap.set(overlay, {
        display: "flex",
      });

      const timeline = gsap.timeline();

      timeline.fromTo(
        overlay,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        }
      );

      timeline.fromTo(
        modal,
        {
          opacity: 0,
          scale: 0.9,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: "back.out(1.5)",
        },
        "-=0.1"
      );

      return () => {
        timeline.kill();
      };
    }

    document.body.style.overflow = "";

    gsap.set(overlay, {
      display: "none",
    });
  }, [isOpen]);

  const closeModal = () => {
    if (!overlayRef.current || !modalRef.current) {
      onCancel?.();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onCancel?.();
      },
    });

    timeline.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
    });

    timeline.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.1"
    );
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : variant === "warning"
        ? "bg-yellow-600 hover:bg-yellow-700"
        : "bg-indigo-600 hover:bg-indigo-700";

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        ref={modalRef}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3h.008M10.29 3.86l-8.82 15a1.5 1.5 0 001.3 2.25h18.46a1.5 1.5 0 001.3-2.25l-8.82-15a1.5 1.5 0 00-2.6 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="mt-5 text-center text-xl font-semibold text-gray-900"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white transition active:scale-95 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;