<script>
export default {
  data() {
  return {
    searchQuery: '',
    showBackToTop: false,
    user: {
      name: 'LingMeow',
      bio: '热爱编程和写作的大学生',
      categories: [
        { id: 1, name: '技术博客' },
        { id: 2, name: '生活随笔' },
        { id: 3, name: '学习笔记' }
      ],
      socialLinks: [
        { name: 'GitHub', icon: '🐙', url: '#' },
        { name: '微博', icon: '🔵', url: '#' },
        { name: '知乎', icon: '🔘', url: '#' }
      ]
    },
    articles: [
        {
  id: 1,
  title: 'Vue基础语法学习笔记',
  date: '2023-10-15',
  category: '技术博客',
  categoryId: 1,
  image: 'https://picsum.photos/id/0/800/400',
  summary: 'Vue是一款流行的JavaScript框架，本文介绍了Vue的模板语法和核心概念...',
  content: 'Vue是一款流行的JavaScript框架，本文介绍了Vue的模板语法和核心概念。包括数据绑定、指令、组件化等内容。通过实际示例讲解如何使用v-for、v-bind和v-on等指令，以及如何组织Vue组件结构。',
  isExpanded: false
},
        {
  id: 2,
  title: 'Flexbox布局完全指南',
  date: '2023-10-10',
  category: '技术博客',
  categoryId: 1,
  image: 'https://picsum.photos/id/180/800/400',
  summary: 'Flexbox是CSS中的一种布局模式，能够轻松实现复杂的布局结构...',
  content: 'Flexbox是CSS中的一种布局模式，能够轻松实现复杂的布局结构。本文详细介绍了Flex容器和项目的属性，包括flex-direction、justify-content、align-items等。通过多个实例展示如何使用Flexbox创建响应式布局，解决常见的布局问题。',
  isExpanded: false
},
        {
  id: 3,
  title: '我的大学生活感悟',
  date: '2023-10-05',
  category: '生活随笔',
  categoryId: 2,
  image: 'https://picsum.photos/id/20/800/400',
  summary: '大学生活是人生中宝贵的经历，在这里我学到了知识，结识了朋友...',
  content: '大学生活是人生中宝贵的经历，在这里我学到了知识，结识了朋友，也遇到了许多挑战。本文分享了我在学习、社团活动和社会实践中的收获与感悟，希望能给学弟学妹们一些启发。大学生活不仅是专业知识的积累，更是个人成长和能力提升的过程。',
  isExpanded: false
}
      ]
    };
  },
  methods: {
  toggleExpand(article) {
    article.isExpanded = !article.isExpanded;
  },
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  goToArticle(id) {
    this.$router.push({ name: 'ArticleDetail', params: { id } });
  },
  filterByCategory(id) {
    this.$router.push({ name: 'Category', params: { id } });
  },
  handleSearch() {
    this.$router.push({ name: 'Search', query: { q: this.searchQuery } });
  }
},
computed: {
  filteredArticles() {
    if (!this.searchQuery) return this.articles;
    const query = this.searchQuery.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.content.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query)
    );
  }
},
mounted() {
  window.addEventListener('scroll', () => {
    this.showBackToTop = window.scrollY > 500;
  });
},
unmounted() {
  window.removeEventListener('scroll', () => {});
}
};
</script>

<template>
  <div class="app-container">
<!-- 顶部标签导航 -->
<div class="tag-navigation">
  <div class="logo" @click="$router.push('/')">My Blog</div>
  <div class="tags-container">
    <span @click="$router.push('/')" :class="$route.name === 'Home' ? 'tag active' : 'tag'">全部文章</span>
    <span @click="filterByCategory(1)" :class="$route.params.id === '1' ? 'tag active' : 'tag'">技术博客</span>
    <span @click="filterByCategory(2)" :class="$route.params.id === '2' ? 'tag active' : 'tag'">生活随笔</span>
    <span @click="filterByCategory(3)" :class="$route.params.id === '3' ? 'tag active' : 'tag'">学习笔记</span>
  </div>
</div>
<router-view />

<!-- 返回顶部按钮 -->
<button v-if="showBackToTop" @click="scrollToTop" class="back-to-top">↑</button>

<!-- 底部信息栏 -->
<footer class="footer">
      <p>© 2025 {{ user.name }} 版权所有</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 导航栏样式优化 */
.tag-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  margin: 2rem auto 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.tags-container {
  display: flex;
  gap: 0.5rem;
}
.tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}
.tag.active {
  background: rgba(255,255,255,0.3);
  font-weight: bold;
}
.tag:hover:not(.active) {
  background: rgba(255,255,255,0.2);
}

.header-banner {
  height: 180px;
  background: linear-gradient(rgba(53, 73, 94, 0.8), rgba(53, 73, 94, 0.9)), url('https://picsum.photos/id/1043/1200/300');
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 0 0 8px 8px;
}

.banner-content h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
}

.search-bar {
  margin: 2rem 0;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.search-btn {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.recent-posts {
  margin-top: 2.5rem;
}

.recent-posts h4 {
  color: #35495e;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.recent-posts ul {
  list-style-type: none;
  padding: 0;
}

.recent-posts li {
  margin-bottom: 0.8rem;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 0.8rem;
  color: #555;
}

.recent-posts li:hover {
  color: #42b883;
  background-color: #f5f9f7;
  padding-left: 1.2rem;
}

.navbar:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-links span {
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-links span:hover {
  background-color: rgba(255,255,255,0.2);
}

/* 主要内容区布局优化 */
.main-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 文章列表样式增强 */
.article-list {
  flex: 3;
}

.article-item {
  background-color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #42b883;
}

.article-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.12);
}

.article-header {
  margin-bottom: 1.5rem;
}

.article-item h2 {
  color: #35495e;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  transition: color 0.3s ease;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-item:hover .featured-image {
  transform: scale(1.03);
}

.date::before {
  content: '📅 ';
  margin-right: 0.3rem;
}

.category {
  background-color: #f0f7f3;
  color: #42b883;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.category::before {
  content: '🏷️ ';
  margin-right: 0.2rem;
}

.article-item h2:hover {
  color: #42b883;
}

.article-item p {
  color: #555;
  line-height: 1.6;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}

/* 按钮样式优化与动画 */
.read-more-btn {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 184, 131, 0.4);
}

.read-more-btn:active {
  transform: translateY(0);
}

/* 侧边栏样式改进 */
.sidebar {
  flex: 1;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  position: sticky;
  top: 2rem;
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  border: 4px solid #f5f5f5;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.user-info h3 {
  color: #35495e;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.user-info p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f7f3;
  color: #42b883;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.2);
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #42b883;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
}

/* 分类样式优化 */
.categories {
  margin-top: 2.5rem;
}

.categories h4 {
  color: #35495e;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.categories ul {
  list-style-type: none;
  padding: 0;
}

.categories li {
  margin-bottom: 0.8rem;
  color: #555;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 0.8rem;
}

.categories li:hover {
  color: #42b883;
  background-color: #f5f9f7;
  padding-left: 1.2rem;
}

/* 底部样式改进 */
.footer {
  text-align: center;
  padding: 2rem;
  margin-top: 3rem;
  color: #777;
  border-top: 1px solid #f0f0f0;
  font-size: 0.95rem;
  background-color: #f9f9f9;
  border-radius: 8px 8px 0 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .navbar {
    padding: 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .article-item, .sidebar {
    padding: 1.5rem;
  }
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.expand-enter-active, .expand-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease;
}

.expand-enter, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
