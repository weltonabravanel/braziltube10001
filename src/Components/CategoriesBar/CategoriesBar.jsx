import React from 'react'
import { useState } from 'react'
import './_categories_bar.scss'
import { useDispatch, useSelector } from 'react-redux'
import { selectCategory } from '../../Redux/Actions/category.action'
import { useEffect } from 'react'
import { allCategoryAction } from '../../Redux/Actions/allCategory.action'

const CategoriesBar = () => {

  const dispatch = useDispatch();
  let {activeCategory} = useSelector(state => state.catgoryState);
  const [activeElement, setActiveElement] = useState(activeCategory.title);
  const handleClick = (value, id) => {
    setActiveElement(value);
    dispatch(selectCategory(value, id));
    window.scrollTo({ top: 0, ScrollBehavior: 'auto' })
  }

  useEffect(()=>{
    setActiveElement(activeCategory.title);
  }, [activeCategory.title]);

  let allCategory = useSelector(state => state.allCategory);
  useEffect(() => {
    !allCategory.loaded && dispatch(allCategoryAction());
  }, [dispatch, allCategory]);

  return (<>
    <div className='categoriesBar'>
      <div>
        {allCategory.loaded &&
          allCategory.allCategory.map((element, index) => {
            return (
              <span
                key={index}
                onClick={() => { handleClick(element.title, element.id) }}
                className={activeElement === element.title ? 'active' : ''}
                title={element.title}
              >{element.title} </span>
            )
          })
        }
      </div>
    </div>
    <div className="category-manage"></div>
  </>)
}

export default CategoriesBar