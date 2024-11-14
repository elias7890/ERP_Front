import "./home.scss"
import TopBox from "../../components/topBox/TopBox";
import ChartBox from "../../components/chartBox/ChartBox";


const home = () => {
  return (
    <div className="home">
      <div className="box box1"><TopBox/></div>
      <div className="box box2"><ChartBox/></div>
      <div className="box box3"><ChartBox/></div>
      <div className="box box4"><ChartBox/></div>
      <div className="box box5"><ChartBox/></div>
      <div className="box box6"><ChartBox/></div>
      <div className="box box7"><ChartBox/></div>
      <div className="box box8"><ChartBox/></div>
      <div className="box box9"><ChartBox/></div>
    </div>
  )
}

export default home
