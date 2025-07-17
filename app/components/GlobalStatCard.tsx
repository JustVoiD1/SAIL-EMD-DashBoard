import Image from 'next/image'
import React from 'react'


const globalStats = ({ title, value, imageURL }: { title: string, value: string | number, imageURL : string}) => {
  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 min-w-fit">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
          </div>
          {/* <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Image src={imageURL} alt='icon' height={20} width={20} />
          </div> */}
        </div>
      </div>
    </>
  )
}

export default globalStats