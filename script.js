const STORAGE_KEY = 'school-news-posts-v1';

const defaultPosts = [
  {
    id: crypto.randomUUID(),
    title: '校园运动会圆满落幕',
    summary: '本届运动会在体育场举行，师生共同见证精彩瞬间。',
    content:
      '<p>本届校园运动会于本周末顺利落幕，活动覆盖田径、集体项目和趣味比赛。</p><p>学生代表积极参与，现场气氛热烈，师生共同见证了许多精彩瞬间。</p>',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: '校园科技节开幕',
    summary: '学生作品展示与创新实验吸引众多师生参观。',
    content:
      '<p>校园科技节在实验楼正式开幕，来自各年级的学生带来项目展示。</p><p>本次活动以“创新与实践”为主题，吸引了大量师生前来参观与交流。</p>',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    return defaultPosts;
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function renderHomePage() {
  const newsList = document.getElementById('newsList');
  if (!newsList) return;

  const posts = getPosts().filter((item) => item.status === 'published');

  if (!posts.length) {
    newsList.innerHTML = '<p>暂无已发布新闻。</p>';
    return;
  }

  newsList.innerHTML = posts
    .map(
      (post) => `
        <article class="card">
          <div class="card-image">
            <img src="${post.image || 'https://via.placeholder.com/800x500?text=校园新闻'}" alt="${post.title}" />
          </div>
          <div class="card-body">
            <div class="meta">${new Date(post.createdAt).toLocaleDateString('zh-CN')}</div>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
          </div>
        </article>
      `
    )
    .join('');
}

function renderAdminPage() {
  const adminList = document.getElementById('adminList');
  if (!adminList) return;

  const posts = getPosts();

  if (!posts.length) {
    adminList.innerHTML = '<p>暂无新闻。</p>';
    return;
  }

  adminList.innerHTML = posts
    .map(
      (post) => `
        <div class="admin-item">
          <div class="admin-top">
            <strong>${post.title}</strong>
            <span class="status ${post.status}">${statusLabel(post.status)}</span>
          </div>
          <p>${post.summary}</p>
          <div class="admin-actions">
            <button class="btn primary" data-action="approve" data-id="${post.id}">通过</button>
            <button class="btn ghost" data-action="reject" data-id="${post.id}">拒绝</button>
          </div>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      updateStatus(id, action === 'approve' ? 'published' : 'rejected');
      renderAdminPage();
    });
  });
}

function updateStatus(id, newStatus) {
  const posts = getPosts();
  const target = posts.find((post) => post.id === id);
  if (!target) return;
  target.status = newStatus;
  savePosts(posts);
}

function statusLabel(status) {
  switch (status) {
    case 'published':
      return '已发布';
    case 'pending_review':
      return '待审核';
    case 'rejected':
      return '已拒绝';
    default:
      return '草稿';
  }
}

function bindSubmitForm() {
  const form = document.getElementById('submitForm');
  const message = document.getElementById('formMessage');
  if (!form || !message) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const summary = document.getElementById('summary').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageFile = document.getElementById('image').files[0];

    if (!title || !summary || !content) {
      message.textContent = '请填写完整内容。';
      return;
    }

    let image = '';
    if (imageFile) {
      image = await fileToDataUrl(imageFile);
    }

    const posts = getPosts();
    posts.unshift({
      id: crypto.randomUUID(),
      title,
      summary,
      content: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
      image,
      status: 'pending_review',
      createdAt: new Date().toISOString()
    });

    savePosts(posts);
    message.textContent = '投稿成功，已进入审核队列。';
    form.reset();
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
