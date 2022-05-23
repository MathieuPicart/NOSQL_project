import Share from "../share/Share";
import Post from "../post/Post";
// import { useState} from "react"
import "./feed.css";
import { Posts } from "../../dummyData";

export default function Feed() {

  // const [posts,setPosts] = useState([]);

  // useEffect(() => {
  //   const res = axios.get("/timeline/ ");
  //   console.log(res)
  // }, [])

  return (
    <div className="feed">
      <div className="feedWrapper">
        <p>Salut {localStorage.getItem("prenom")+ " " + localStorage.getItem("nom")}</p>
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
