// import "./TopBox.scss"
// import {topDealUsers} from "../../data"
// import { fetchIndicators } from "../../apis/indicador"

// const TopBox = ({ topDealUsers }) => {
//     return (
//       <div className="topBox">
//         <h1>Top Deals</h1>
//         <div className="list">
//           {topDealUsers.map(user => (
//             <div className="listItem" key={user.id}>
//               <div className="user">
//                 <img src={user.img} alt={user.username} />
//                 <div className="UserTexts">
//                   <span className="username">{user.username}</span>
//                   <span className="email">{user.email}</span>
//                 </div>
//               </div>
//               <span className="amount">${user.amount}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };
  

// export default TopBox

import React, { useEffect, useState } from 'react';
import "./TopBox.scss";
// import { fetchIndicators } from "../../apis/indicador";

const TopBox = () => {
  const [topDealUsers, setTopDealUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const loadIndicators = async () => {
  //     try {
  //       setLoading(true); 
  //       const data = await fetchIndicators(); 
  //       setTopDealUsers(data);
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false); 
  //     }
  //   };

  //   loadIndicators();
  // }, []);

  // if (loading) return <p>Cargando...</p>;
  // if (error) return <p>Error al cargar los datos.</p>;

  return (
    <div className="topBox">
      {/* <h1>Indicadores Financieros</h1>
      <div className="list">
        {topDealUsers.map(user => (
          <div className="listItem" key={user.id}>
            <div className="user">
              <img src={user.img} alt="" />
              <div className="UserTexts">
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">${user.amount}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TopBox;

