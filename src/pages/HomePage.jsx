import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';


export default function HomePage(){


    return(
        <div className='Home'>
            <h1>Home page</h1>
            <nav>
                <div className='postings'>
                <Link to ="/create" className='link'>create post</Link>
                <Link to="/ViewPosts" className='link'>posts</Link>
                </div>
                <div className='user'>
                    <img src='../src/assets/default.png'alt="user image"/>
                    <div className='drop-down'>
                        <Link to ="/LoginPage" className='link'>Login</Link>
                        <Link to="/SigninPage"className='link'>Sign up</Link>
                    </div>
                </div>
            </nav>

            <section>
                
                <p>This is a forum to talk about any image or art form</p>

            </section>

        </div>

    )

}