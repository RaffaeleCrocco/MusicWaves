import React,{useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faAngleLeft, faAngleRight, faPause} from '@fortawesome/free-solid-svg-icons';

const Player = ({currentSong, isPlaying, setIsPlaying, audioRef, songs, setCurrentSong, setSongs}) => {
    //State
    const [songInfo, setSongInfo] = useState({currentTime:0, duration:0, animationPercentage: 0});

    //Event Handler
    const playSongHandler = () => {
        if(isPlaying){
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        }else{
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    }

    const timeUpdateHandler = (e) => {
        const current = e.target.currentTime;
        const duration = e.target.duration;
        //Calculate percentage
        const roundedCurrent = Math.round(current);
        const roundedDuration = Math.round(duration);
        const animation = Math.round((roundedCurrent / roundedDuration)*100);

        setSongInfo({...songInfo, currentTime:current, duration: duration, animationPercentage: animation});
    }

    const getTime = (time) => {
        return(
            Math.floor(time / 60)+":"+("0"+Math.floor(time % 60)).slice(-2)
        )
    }

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo, currentTime:e.target.value});
    }

    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
        if (direction === 'skip-forward'){
            await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
        }
        if (direction === 'skip-back'){
            if((currentIndex - 1) %songs.length === -1){
                await setCurrentSong(songs[songs.length -1]);
                activeLibraryHandler(songs[songs.length -1]);
                if(isPlaying) audioRef.current.play();
                return;
            }
            await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
            activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
        }
        if(isPlaying) audioRef.current.play();
    }

    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((song)=>{
            if(song.id===nextPrev.id){return{...song, active:true}}
            else{return{...song,active:false}}
        });
        setSongs(newSongs);
    }

    //Add the style for the track range
    const trackAnimation = {transform: `translateX(${songInfo.animationPercentage}%)`};
    const trackColor = {background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`};

    return(
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <div style={trackColor} className="track">
                    <input min="0" max={songInfo.duration || 0} value={songInfo.currentTime} type="range" onChange={dragHandler} />
                    <div style={trackAnimation} className="animate-track"></div>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon className="skip-back" icon={faAngleLeft} size="2x" onClick={() => skipTrackHandler('skip-back')} />
                <FontAwesomeIcon className="play" icon={isPlaying ? faPause : faPlay} size="2x" onClick={playSongHandler} />
                <FontAwesomeIcon className="skip-forward" icon={faAngleRight} size="2x" onClick={() => skipTrackHandler('skip-forward')} />
            </div>
            <audio onTimeUpdate={timeUpdateHandler} onLoadedMetadata={timeUpdateHandler} ref={audioRef} src={currentSong.audio} onEnded={() => skipTrackHandler('skip-forward')} ></audio>
        </div> 
    );
};

export default Player;