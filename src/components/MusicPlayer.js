import React, { useReducer, useRef, useState, useEffect } from "react";
import logo from './musiclogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlay, faClock, faPause, faShuffle, faVolumeXmark, faVolumeLow, faVolumeHigh, faMusic, faBackward, faForward  } from '@fortawesome/free-solid-svg-icons';

import {songs} from './songs';
import './style.css'
export default function MusicPlayer () {
    const audioref=useRef(null);
    const [duration, setduration]=useState(0);
    const [time, setTime]=useState(0);
    const [isplaying, setisplaying]=useState(false);
    const [songlist, setsonglist]=useState(songs);
    const[volumeicon, setvolumeicon]=useState(faVolumeLow);
    const [timer, settimer]=useState(45);
    const [showtimer, setshowtimer]=useState(false);
    
    useEffect(() => {
        if ( timer > 0) {
          const timerId = setTimeout(() => {
            audioref.current.pause();
            setisplaying(false);
          }, timer * 60 * 1000);
          return () => clearTimeout(timerId);
        }
      }, [timer]);

    function reducer(state, action) {
        switch (action.type) {
            case "prev":
                return{ current: state.current ===0?songs.length-1:state.current-1}
            case "next":
                return{ current: state.current===songs.length-1?0:state.current+1}
            case  "choosen":
                setisplaying(true);
                audioref.current.autoplay=true;
                return{current: action.index}
            default:
                return state;
        }
    }

    

    const [state, dispatch] = useReducer(reducer, { current: 0 });

    //prev Button
    const handlePrev = () => {
        audioref.current.autoplay=true;
        setisplaying(true);
        dispatch({ type: "prev" });
    };

    //next button
    const handleNext = () => {
        audioref.current.autoplay=true;
        setisplaying(true);
        dispatch({ type: "next" });
    };

    //play pause
    const handleplay=()=>{

        if(audioref.current.paused){
            audioref.current.play();
            setisplaying(true);
        }
        else{
            audioref.current.pause();
            setisplaying(false);
        }
    }

    //When auto ended
    const handleedning=()=>{
        setisplaying(true);
        audioref.current.autoplay=true;
        dispatch({type:"next"});
    }

    //handle Volume control
    const handlevolume=(e)=>{
        const temp=e.target.value;
        audioref.current.volume=(e.target.value/100);
       if(temp>50){
        setvolumeicon(faVolumeHigh);
       }
       if(temp==0)
        setvolumeicon(faVolumeXmark);
       if(temp<50 && temp>0)
        setvolumeicon(faVolumeLow)
    }

    //handle audio Time
    const handletime=()=>{

        setTime(parseInt(audioref.current.currentTime));
    }

    //handle song time
    const handlesong=(e)=>{
        const time=e.target.value;
        audioref.current.currentTime=time;
    }

    //handle duration of song
    const handledata=()=>{
        setduration(audioref.current.duration)
    }

    //handle suffling
    const handlesuffle=()=>{
        songs.sort(() => Math.random() - 0.5)
        setsonglist(songlist);
        handleNext();
    }

    const handlelist=(i)=>{
        dispatch({type:"choosen", index:i})

    }
    const handletimer=()=>{
        setshowtimer(!showtimer);
        settimer(45);
    }
    const handleshowtimer=(e)=>{
        settimer(e.target.value);
    }

    
    
    return (
        <>
            <div className="container">
                <div className="box">
                    <div className="left">
                        <h1><FontAwesomeIcon icon={faBars}/> Playlist
                        <span onClick={handletimer}>
                            <FontAwesomeIcon icon={faClock}/></span></h1>
                        <div className="slider">
                           {showtimer &&  <input className="timer" onChange={handleshowtimer} type="range" min="0" max="90"/> } 
                           {showtimer&& <p>{timer}</p>} 
                        </div>
                        <ul>
                        { songs.map((e, i)=>{
                                return(
                                    <li key={i} onClick={()=>{handlelist(i)}}>{e.title}{state.current===i && <FontAwesomeIcon className="playstatus"icon={faMusic}/>}</li>
                                    
                                )
                            })}
                        </ul>
                    </div>
                    <div className="right">
                        <div className="top">
                            <h1>{songs[state.current].title}</h1>
                            <p>{songs[state.current].singer}</p>
                        </div>
                        <div className="middle">
                            <img src={logo} alt=""/>
                        </div>
                        <div className="bottom">
                            <button className="shufflebutton" onClick={handlesuffle}><FontAwesomeIcon icon={faShuffle}/></button>

                            <input className="volumeinput" onChange={handlevolume} type="range" min="0" default="50" max="100"/>

                            <FontAwesomeIcon className="volumeicon"icon={volumeicon} />

                            <p className="time" >{`${parseInt(time/60)}:${time%60}`}</p>

                            <p className="duration" >{`${parseInt(duration /60)}:${parseInt(duration%60)}`}</p>

                            <input className="songrange"onChange={handlesong} type="range" min="0" value={time} max={duration}/>

                        <div className="controls">
                            <button className="prev"onClick={handlePrev}><FontAwesomeIcon icon={faBackward}/></button>
                            <button className="play" onClick={handleplay}><FontAwesomeIcon  icon={isplaying?faPause:faPlay}/></button>
                            <button className="next" onClick={handleNext}><FontAwesomeIcon  icon={faForward}/></button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <audio
              ref={audioref} 
              onLoadedMetadata={handledata} 
              onTimeUpdate={handletime} 
              className="reactplayer" 
              onEnded={handleedning}
              controls src={songs[state.current].src}>
        </audio>
        </>
    );
}
