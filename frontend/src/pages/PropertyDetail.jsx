// // import React, { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import PropertyInfo from "../pages/PropertyInfo";
// // import PlotList from "../pages/PlotList";
// // import AddPlot from "../pages/AddPlot";
// // import { Button } from "react-bootstrap";

// // export default function PropertyDetailPage() {
// //   const { id } = useParams();
// //   const [property, setProperty] = useState(null);
// //   const [notFound, setNotFound] = useState(false);
// //   const navigate = useNavigate();

// //   const fetchProperty = async () => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       const res = await axios.get(`http://localhost:5000/api/property/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (res.data) {
// //         setProperty(res.data);
// //         setNotFound(false);
// //       } else {
// //         setNotFound(true);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching property:", err);
// //       setNotFound(true);
// //     }
// //   };

// //   useEffect(() => {
// //     if (id) {
// //       fetchProperty();
// //     } else {
// //       setNotFound(true);
// //     }
// //   }, [id]);

// //   // ✅ If property not found or invalid
// //   if (notFound) {
// //     return (
// //       <div className="container mt-5 text-center">
// //         <h4>Please select a property first</h4>
// //         <Button
// //           variant="primary"
// //           className="mt-3"
// //           onClick={() => navigate("/dashboard/properties/list")}
// //         >
// //           Select Property
// //         </Button>
// //       </div>
// //     );
// //   }

// //   if (!property) return <div>Loading...</div>;

// //   return (
// //     <div className="container mt-3">
// //       {/* Property Info */}
// //       <PropertyInfo property={property} />

// //       {/* Add Plot */}
// //       <AddPlot propertyId={id} onPlotAdded={fetchProperty} />

// //       {/* Plot List */}
// //       <h4 className="mt-4">Plot List</h4>
// //       <PlotList plots={property.plots} />
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import PropertyInfo from "../pages/PropertyInfo";
// import PlotList from "../pages/PlotList";
// import AddPlot from "../pages/AddPlot";
// import { Button } from "react-bootstrap";

// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const [notFound, setNotFound] = useState(false);
//   const navigate = useNavigate();

//   const fetchProperty = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5000/api/property/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data) {
//         setProperty(res.data);
//         setNotFound(false);
//       } else {
//         setNotFound(true);
//       }
//     } catch (err) {
//       console.error("Error fetching property:", err);
//       setNotFound(true);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchProperty();
//     } else {
//       setNotFound(true);
//     }
//   }, [id]);

//   if (notFound) {
//     return (
//       <div className="container mt-5 text-center">
//         <h4>Please select a property first</h4>
//         <Button
//           variant="primary"
//           className="mt-3"
//           onClick={() => navigate("/dashboard/properties/list")}
//         >
//           Select Property
//         </Button>
//       </div>
//     );
//   }

//   if (!property) return <div>Loading...</div>;

//   return (
//     <div className="container mt-3">
//       {/* Property Info */}
//       <PropertyInfo property={property} />

//       {/* Add Plot */}
//       <AddPlot propertyId={id} onPlotAdded={fetchProperty} />

//       {/* Plot List */}
//       <h4 className="mt-4">Plot List</h4>

//       {/* 👇 YEH LINE UPDATE KI GAYI HAI 👇 */}
//       <PlotList
//         plots={property.plots}
//         propertyId={id} // Added propertyId for the API call in PlotList
//         onPlotUpdated={fetchProperty} // Added function to refresh list after update
//         userRole={currentUser.role}
//       />
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyInfo from "../pages/PropertyInfo";
import PlotList from "../pages/PlotList";
import AddPlot from "../pages/AddPlot";
import { Button } from "react-bootstrap";

// 👇 STEP 1: Apne AuthContext se useAuth hook import karein
import { useAuth } from "../context/AuthContext";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  // 👇 STEP 2: Context se user ka data nikalein
  const { user } = useAuth();

  console.log(user.role);

  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/property/${id}`, { // 'property' ko 'properties' kar diya
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setProperty(res.data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
      setNotFound(true);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="container mt-5 text-center">
        <h4>Please select a property first</h4>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => navigate("/dashboard/properties/list")}
        >
          Select Property
        </Button>
      </div>
    );
  }

  if (!property) return <div>Loading...</div>;

  return (
    <div className="container mt-3">
      <PropertyInfo property={property} />
      <AddPlot propertyId={id} onPlotAdded={fetchProperty} />

      <h4 className="mt-4">Plot List</h4>

      <PlotList
        plots={property.plots}
        propertyId={id}
        onPlotUpdated={fetchProperty}
        userRole={user?.role} // Ab 'user' variable yahan available hai
      />
    </div>
  );
}