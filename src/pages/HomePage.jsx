import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';


export default function HomePage(){


    return(
        <div className='Home'>
            <nav>
                <div className='postings'>
                <Link to ="/create" className='link'>create post</Link>
                <Link to="/ViewPosts" className='link'>posts</Link>
                </div>
                <div className='user'>
                    <img src=''alt="user image"/>
                    <div className='drop-down'>
                        <Link to ="" className='link'>Login</Link>
                        <Link to=""className='link'>Sign up</Link>
                    </div>
                </div>
            </nav>

            <section>
                <h1>This is the home page</h1>
                <p>This is a forum to talk about any image or art form</p>

            </section>

        </div>

    )

}