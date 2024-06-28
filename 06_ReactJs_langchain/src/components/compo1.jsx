import React, { useState } from 'react';
import { askJarvisChef } from '../utils/askJarvisChef';


const JarvisChef = ()=> {
    const [humanMessage, setHumanMessage] = useState('');
    const [recipe, setRecipe] = useState('');
    const handleInputChange = (e)=> {
        setHumanMessage(e.target.value)
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        console.log(humanMessage);
        const res_recipe = await askJarvisChef(humanMessage);
        setRecipe(res_recipe);
    }
    return (
        <>
            <h1>Ask your recipes</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={humanMessage} onChange={handleInputChange} placeholder='ask your recipes'/>
                <button>Ask</button>
            </form>
            <pre>{recipe}</pre>
        </>
    )
}

export default JarvisChef;