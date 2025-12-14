import { toast, Zoom } from 'react-toastify';

const defaultOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light",
  transition: Zoom,
};

const showToast = (type, message, options = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
 
  switch (type) {
    case 'success':
      toast.success(message, mergedOptions);
      break;
    case 'error':
      toast.error(message, mergedOptions);
      break;
    case 'warning':
      toast.warning(message, mergedOptions);
      break;
    default:
      toast(message, mergedOptions); // Default toast if type is unknown
  }
};

export default showToast;
