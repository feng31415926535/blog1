import { defineStore } from 'pinia'
import { ref } from 'vue'

// 模拟初始文章数据
const initialArticles = [
  { id: 1, title: 'Vue基础语法学习笔记', date: '2023-10-15', category: '技术博客', categoryId: 1, image: 'https://picsum.photos/id/0/800/400', summary: 'Vue是一款流行的JavaScript框架...', content: 'Vue是一款流行的JavaScript框架...' },
  { id: 2, title: 'Flexbox布局完全指南', date: '2023-10-10', category: '技术博客', categoryId: 1, image: 'https://picsum.photos/id/180/800/400', summary: 'Flexbox是CSS中的一种布局模式...', content: 'Flexbox是CSS中的一种布局模式...' },
  { id: 3, title: '我的大学生活感悟', date: '2023-10-05', category: '生活随笔', categoryId: 2, image: 'https://picsum.photos/id/20/800/400', summary: '大学生活是人生中宝贵的经历...', content: '大学生活是人生中宝贵的经历...' }
]

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref(initialArticles)

  const addArticle = (newArticle) => {
    newArticle.id = Date.now()
    newArticle.date = new Date().toISOString().split('T')[0]
    articles.value.unshift(newArticle)
  }

  const getArticleById = (id) => {
    return articles.value.find(article => article.id === Number(id))
  }

  const getArticlesByCategory = (categoryId) => {
    return articles.value.filter(article => article.categoryId === Number(categoryId))
  }

  return { articles, addArticle, getArticleById, getArticlesByCategory }
})