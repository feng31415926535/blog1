<template>
  <div class="article-detail">
    <button @click="$router.go(-1)" class="back-btn">← 返回</button>
    <article v-if="article">
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <span class="date">{{ article.date }}</span>
          <span class="category">{{ article.category }}</span>
        </div>
      </div>
      <div class="article-image">
        <img :src="article.image" :alt="article.title" class="featured-image">
      </div>
      <div class="article-content">
        <p>{{ article.content }}</p>
        <p>这是一篇关于{{ article.category }}的技术文章，希望能对您有所帮助。</p>
        <p>在实际应用中，这里可以放置完整的文章内容，支持Markdown格式展示。</p>
      </div>
    </article>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useArticlesStore } from '@/store/articles';
export default {
  props: ['id'],
  setup(props) {
    const articlesStore = useArticlesStore();
    const article = ref(null);

    onMounted(() => {
      article.value = articlesStore.getArticleById(props.id);
    });

    return { article };
  }
};
</script>

<style scoped>
.article-detail {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
}

.back-btn {
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #35495e;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #888;
  font-size: 0.9rem;
}

.date::before {
  content: '📅 ';
}

.category::before {
  content: '📁 ';
}

.article-image {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.article-content {
  line-height: 1.8;
  color: #333;
  font-size: 1.1rem;
}

.article-content p {
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #888;
}
</style>