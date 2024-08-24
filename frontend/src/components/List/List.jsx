import './List.scss'
import Card from "../Card/Card"

const List = ({residencies}) =>{
  return (
    <div className='list'>
      {residencies?.map(item=>(
        <Card key={item.id} item={item}/>
      ))}
    </div>
  )
}

export default List