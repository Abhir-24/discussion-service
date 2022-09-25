import { Grid,Typography,Avatar,Stack,Link } from "@mui/material"
import { useState } from "react"

const Card = () => {
    const [like,setLike] = useState(false)

    const toggle = () => setLike(!like)

  return (
    <div className="Card">
      <div className="main">        
      <div className="card">
            <Grid container spacing={2}>
              <Grid item xs={4} style={{'paddingTop': '0'}}>
                <img className="img-post" src="https://miro.medium.com/max/800/0*0ZgS_Z1-5VBdbN3u.png" alt="post_img" />
              </Grid> 
              <Grid item xs={8} style={{'paddingTop': '0','paddingLeft': '0'}}>
                <br /><br />
                <Typography variant='h4'>
                  Post heading
                  </Typography>
                <br />
                <Typography>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, nulla? Quo itaque doloribus fugiat commodi.
                </Typography>
                <br />
                <Typography color="gray">
                  Created By: Naman
                  <br />
                  <button onClick={toggle} style={{cursor: 'pointer',padding: 5,border: '1px solid #0d6efd'}} className={`liked-btn ${like ? 'liked' : ''}`}>
                    👍 Like
                    </button>
                </Typography>
                <br />
                <Typography align="right" marginRight={5}>
                    <button className='btn'>Read More </button>
                </Typography>
                <br />
              </Grid> 
            </Grid>
          </div>
      </div>
    </div>
  )
}

export default Card