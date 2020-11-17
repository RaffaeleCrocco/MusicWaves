import React,{useState, useRef} from "react";
//Import styles
import './style/app.scss';

//Import songs data
import data from './data';

//Adding components
import Player from './components/Player';
import Song from './components/Song';
import Library from "./components/Library";
import Nav from "./components/Nav";

function App() {
  //References
  const audioRef = useRef(null);

  //State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}/>
      <Song currentSong={currentSong} />
      <Player songs={songs} setSongs={setSongs} currentSong={currentSong} setCurrentSong={setCurrentSong} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioRef={audioRef} />
      <Library songs={songs} setSongs={setSongs} setCurrentSong={setCurrentSong} audioRef={audioRef} isPlaying={isPlaying} libraryStatus={libraryStatus} />
    </div>
  );
}

export default App;
