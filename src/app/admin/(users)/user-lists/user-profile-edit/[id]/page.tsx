"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const {id} = useParams()
  console.log('id:', id);
  return (    
    <div>
      fsdf
    </div>
  )
}

export default Page
