<template>
  <div class="home-container">
    <div v-if="isAdmin" class="admin-avatar-container">
      <img :src="userAvatar" class="admin-avatar" alt="Admin Avatar">
      <button @click="handleOpenAvatarCropper" class="change-avatar-btn">更换头像</button>
      <AvatarCropper v-if="showAvatarCropper" ref="avatarCropper" @avatar-cropped="handleAvatarCropped"/>
    </div>
    <!-- 顶部横幅 -->
    <div class="header-container">
      <div class="header-banner">
        <div class="banner-content">
          <h1>欢迎来到我的技术博客</h1>
          <p>分享前端开发技术和经验</p>
        </div>
      </div>
      <nav class="top-nav">
        <div class="nav-right">
          <button @click="toggleDarkMode" class="theme-toggle">
  <Sunny v-if="isDarkMode" class="icon" />
  <Moon v-else class="icon" />
</button>
          <AdminLoginForm v-if="!isAdmin" @login="handleLogin" class="admin-login-desktop"/>
          <div v-if="isAdmin" class="admin-user-menu">
            <img :src="user.avatar" alt="Avatar" class="avatar-small" v-if="user.avatar">
            <span class="admin-badge"><i class="admin-icon">🔧</i> 管理员</span>
            <button @click="authStore.logout()" class="logout-btn-small">退出</button>
          </div>
        </div>
      </nav>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="user-info">
          <img :src="user.avatar" alt="Avatar" class="avatar" v-if="user.avatar">
          <h3>{{ user.name }}</h3>
          <p>{{ user.bio }}</p>
          <div v-if="isAdmin" class="avatar-upload">
            <AvatarCropper @avatar-cropped="handleAvatarCropped"/>
            <label class="upload-btn">更换头像</label>
          </div>
          <div class="social-links">
            <a href="#" class="social-link" title="GitHub">🐙</a>
            <a href="#" class="social-link" title="微博">🔵</a>
            <a href="#" class="social-link" title="知乎">🔘</a>
          </div>
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="搜索文章..." class="search-input">
          <button class="search-btn" @click="handleSearch">🔍</button>
        </div>
        <div v-if="isAdmin" class="admin-actions">
          <h4>管理员功能</h4>
          <button @click="showPublishForm = !showPublishForm" class="publish-btn">发布新文章</button>
          <div v-if="showPublishForm" class="publish-form">
            <h5>发布新文章</h5>
            <input v-model="newArticle.title" placeholder="文章标题" class="form-input">
            <select v-model="newArticle.categoryId" class="form-select">
              <option value="1">技术博客</option>
              <option value="2">生活随笔</option>
              <option value="3">学习笔记</option>
            </select>
            <input v-model="newArticle.image" placeholder="图片URL" class="form-input">
            <textarea v-model="newArticle.summary" placeholder="摘要" class="form-textarea"></textarea>
            <textarea v-model="newArticle.content" placeholder="正文内容" class="form-textarea"></textarea>
            <button @click="publishArticle" class="submit-article">发布</button>
          </div>
        </div>

        <div class="recent-posts">
          <h4>最新文章</h4>
          <ul>
            <li v-for="post in articles.slice(0,3)" :key="post.id" @click="goToArticle(post.id)" class="recent-post-item">{{ post.title }}</li>
          </ul>
        </div>

      </aside>
      <!-- 文章列表区 -->
      <section class="articles-section">
        <div class="section-header">
          <h2>{{ $route.name === 'Category' ? '分类文章' : $route.name === 'Search' ? '搜索结果' : '最新文章' }}</h2>
        </div>

        <div class="articles-list">
          <article v-for="article in filteredArticles" :key="article.id" class="article-card">
            <div class="article-image">
              <img :src="article.image" :alt="article.title" class="featured-image">
            </div>
            <div class="article-content">
              <div class="article-header">
                <h3 class="article-title">{{ article.title }}</h3>
                <div class="article-meta">
                  <span class="date">{{ article.date }}</span>
                  <span class="category">{{ article.category }}</span>
                </div>
              </div>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-footer">
                <button @click="goToArticle(article.id)" class="read-more-btn">阅读更多</button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script>

import { useArticlesStore } from '@/store/articles'
import { useAuthStore } from '@/store/auth'
import { ref, computed, nextTick, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { Sunny, Moon } from '@vicons/ionicons5'
import AdminLoginForm from '@/components/AdminLoginForm.vue'
import AvatarCropper from '@/components/AvatarCropper.vue'

export default {
  components: {
    Sunny,
    Moon,
    AdminLoginForm,
    AvatarCropper
  },
  data() {
    return {
      searchQuery: '',
      showPublishForm: false,
      newArticle: {
        title: '',
        categoryId: 1,
        image: '',
        summary: '',
        content: ''
      }
    };
  },
  setup() {
      const articlesStore = useArticlesStore()
      const authStore = useAuthStore()
      const showAvatarCropper = ref(false);
      const isAdmin = computed(() => authStore.isAdmin);
      const userAvatar = computed(() => authStore.user.avatar);

      const avatarCropper = ref(null);

const handleOpenAvatarCropper = () => {
  showAvatarCropper.value = true;
};

watch(showAvatarCropper, (newVal) => {
  if (newVal) {
    nextTick(() => {
      avatarCropper.value?.triggerFileInput();
    });
  }
});

const handleAvatarCropped = (newAvatarUrl) => {
  authStore.updateAvatar(newAvatarUrl);
  showAvatarCropper.value = false;
};

    const { articles } = storeToRefs(articlesStore)
    const { user, darkMode } = storeToRefs(authStore)

    return {
      articlesStore,
      authStore,
      showAvatarCropper,
      isAdmin,
      userAvatar,
      handleAvatarCropped,
      articles,
      user,
      darkMode
    }
  },
  methods: {

    handleLogin(password) {
      const success = this.authStore.loginAsAdmin(password)
      if (success) {
        alert('管理员登录成功！')
      } else {
        alert('密码错误，请重试')
      }
    },
    toggleDarkMode() {
      this.authStore.toggleDarkMode();
    },
    handleAvatarCropped(base64Image) {
      this.authStore.updateAvatar(base64Image)
      alert('头像更新成功！')
    },
    publishArticle() {
      if (!this.newArticle.title || !this.newArticle.content) {
        alert('请填写标题和正文内容')
        return
      }
      // 设置分类名称 based on categoryId
      const categories = {1: '技术博客', 2: '生活随笔', 3: '学习笔记'}
      this.newArticle.category = categories[this.newArticle.categoryId]
      this.articlesStore.addArticle(this.newArticle)
      // 重置表单
      this.newArticle = { title: '', categoryId: 1, image: '', summary: '', content: '' }
      this.showPublishForm = false
      alert('文章发布成功！')
    },
    goToArticle(id) {
      this.$router.push({ name: 'ArticleDetail', params: { id } });
    },

    handleSearch() {
      this.$router.push({ name: 'Search', query: { q: this.searchQuery } });
    }
  },
  props: ['categoryId'],
  computed: {
    filteredArticles() {
      let result = this.articles;
      // 分类过滤
      if (this.$route.name === 'Category' && this.$route.params.id) {
        result = result.filter(article => article.categoryId === Number(this.$route.params.id));
      }
      // 搜索过滤
      if (this.$route.name === 'Search' && this.$route.query.q) {
        const query = this.$route.query.q.toLowerCase();
        result = result.filter(article => 
          article.title.toLowerCase().includes(query) || 
          article.content.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        );
      }
      return result;
    }
  }
}
</script>

<style scoped>
.admin-avatar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: center;
}

.admin-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #42b883;
}

.change-avatar-btn {
  margin-top: 8px;
  padding: 4px 8px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.change-avatar-btn:hover {
  background-color: #359469;
}
/* 样式内容与原App.vue中的文章列表样式保持一致 */
.header-container {
  position: relative;
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
}

.top-nav {
  background-color: #ffffff;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.admin-user-menu {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.logout-btn-small {
  padding: 4px 10px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.admin-login-desktop {
  display: flex;
  align-items: center;
}

.banner-content {
  text-align: center;
  padding: 20px;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.main-content {
  display: flex;
  gap: 2rem;
}

.sidebar {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-info {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.search-bar {
  margin-bottom: 2rem;
}

.publish-btn {
  width: 100%;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.recent-posts, .categories {
  margin-bottom: 2rem;
}

.recent-post-item, .category-item {
  padding: 0.5rem 0;
  cursor: pointer;
  transition: color 0.3s;
}

.admin-login {
  margin-top: 1rem;
}

.recent-post-item:hover, .category-item:hover {
  color: #42b883;
}

.articles-section {
  flex: 3;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  .sidebar {
    order: -1;
    margin-bottom: 2rem;
  }
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #42b883;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .featured-image {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-header {
  margin-bottom: 1rem;
}

.article-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #35495e;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #888;
}

.date::before {
  content: '📅 ';
}

.category::before {
  content: '📁 ';
}

.article-summary {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.read-more-btn:hover {
  background-color: #359469;
}

/* 管理员样式 */
.admin-badge {
  background-color: #42b883;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.admin-login {
  margin-top: 1rem;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.login-form {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.password-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.login-btn, .submit-login, .publish-btn, .upload-btn {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover, .submit-login:hover, .publish-btn:hover, .upload-btn:hover {
  background-color: #359469;
}

.logout-btn {
  width: 100%;
  padding: 8px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #cc0000;
}

.avatar-upload {
  margin-top: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.publish-form {
  margin-top: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-article {
  padding: 10px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  transition: background-color 0.3s;
}

.submit-article:hover {
  background-color: #359469;
}
</style>