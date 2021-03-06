import styles from '../../styles/Feed.module.css';
import {Toolbar} from '../../components/toolbar';
import {  useRouter } from 'next/router';



export const Feed = ({pageNumber, articles}) =>{  
  const router = useRouter();

  const prevPage = () =>{
    if(pageNumber > 1){
      router.push(`/feed/${pageNumber - 1}`)
    }
  }
  const nextPage = () =>{
    if(pageNumber < 5){
      router.push(`/feed/${pageNumber + 1}`)
    }
  }

  return(
   <div className='page-container'>
     <Toolbar />
      <div className={styles.main}>
      {articles.map((article, index )=> (
        <div key={index}className={styles.post}>
          <h1 
            onClick={() => (window.location.href = article.url)}
          >{article.title}</h1>
          <p>{article.description}</p>
          {!!article.urlToImage && <img src= {article.urlToImage} alt="img"/>}
        </div>
      ))}
    </div>
        <div className={styles.paginator}>
          <div
            onClick={()=> prevPage()}
            className={pageNumber === 1 ? styles.disable : styles.active}>
              Previous Page
          </div>
          <div>#{pageNumber}</div>
          <div 
            onClick={() => nextPage()}
            className={ pageNumber === 5 ? styles.disable : styles.active}
          >
            Next Page
          </div>
        </div>
   </div>
   
  )
};

export const getServerSideProps = async pageContext => {
  const pageNumber = pageContext.query.slug;

  if(!pageNumber || pageNumber < 1 || pageNumber > 5){
    return {
      props: {
        articles: [],
        pageNumber: 1
      }
    }
  }
  const apiResponse = await fetch(`https://newsapi.org/v2/top-headlines?country=br&pageSize=5&page=${pageNumber}`,
  {
    headers:{
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NEWS_KEY}`,
    },
  },
  );

  const apiJson = await apiResponse.json();

  const { articles } = apiJson;

  return {
    props: {
      articles,
      pageNumber: Number.parseInt(pageNumber)
    }
  }
};

export default Feed;