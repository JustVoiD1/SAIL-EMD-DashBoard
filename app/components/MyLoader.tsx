import React from 'react'

const MyLoader = ({content} : {content?: string}) => {
  return (
    <div className="h-screen w-screen flex items-center justify-cente fixed inset-0 bg-background/50 backdrop-blur-sm justify-center p-4 z-50r">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-secondary">{content ? content : 'Loading...'}</p>
      </div>
    </div>
  )
}

export default MyLoader