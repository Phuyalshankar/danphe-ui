'use strict';

const HomeScreen = () => {
    return (
        <div className='card bg-white h-screen w-full p-2'>
            <div className='w-full bg-white items-center justify-center flex flex-col gap-2'>
                <h1>My dolphin app</h1>
                <div className='fontSize-28 flex w-20 h-20 justify-center items-center bg-gray-150 rounded-full'>🐬</div>
            </div>
            <div className='card flex flex-col gap-4'>
                <label htmlFor="">Enter Your Email</label>
                <input type="email"
                    varient='filled'
                    label='Enter Your Email'
                    placeholder='Enter Your Email'
                    icon='Email'
                    iconColor='blue'
                    iconSize='24'
                    className='bg-blue-100'
                />
                <label htmlFor="">Enter Your Password</label>
                <input type="password"
                    placeholder=''
                    label='Enter Your Password'
                    icon='wifi'
                    iconColor='blue'
                    iconSize='30'
                    className='bg-blue-100'
                />
                <button className='bg-gradient-blue-500-600-300-45 rounded-2xl p-4 mt-4 text-lg text-white w-full'>
                    Submit
                </button>
            </div>
        </div>
    );
};

// यसले यो फाइललाई बाहिर उपलब्ध गराउँछ
module.exports = HomeScreen;