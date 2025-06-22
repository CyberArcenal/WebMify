import { apiClient } from "@js/api/auth";
import {
  showError,
  showSuccess,
  showWarning,
  showInfo,
} from "@js/utils/notifications";

export default class BlogDetailPage {
  constructor() {
    this.blogData = null;
    this.isLoading = true;
    this.blogSlug = this.getBlogSlugFromUrl();
    this.flatComments = [];
    this.subscribeForms = document.querySelectorAll(".subscribe-form");
  }

  getBlogSlugFromUrl() {
    const hash = window.location.hash;
    if (hash.startsWith("#blog-detail/")) {
      return hash.split("/").pop();
    }
    return null;
  }

  async init() {
    if (!this.blogSlug) {
      this.handleError(new Error("Invalid blog slug"));
      return;
    }

    try {
      this.showLoadingState();
      await this.fetchBlogData();
      await this.fetchComments();
      await this.fetchRelatedArticles();
      await this.fetchProfile();
      this.renderBlogDetails();
      this.updatePageMetadata();
      this.setupNewsletter();
      this.setupSocialSharing();
      this.setupCommentForm(); // Add this line
      this.addAnimations();
      this.initEventListeners();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoadingState();
    }
  }
  initEventListeners() {
    this.subscribeForms.forEach((form) => {
      const button = form.querySelector("button");
      console.log("Subscribe button:", button);
      if (button) {
        button.addEventListener("click", this.handleSubscribe.bind(this));
      }
    });
  }
  showLoadingState() {
    this.isLoading = true;
    document.getElementById("app").classList.add("opacity-75");
    const loader = document.getElementById("blog-loader");
    if (loader) loader.classList.remove("hidden");
  }
  async handleSubscribe(e) {
    e.preventDefault();
    const form = e.target.closest("div");
    const emailInput = form.querySelector(".email-subscribe-input");
    const email = emailInput.value.trim();

    if (!email) {
      showWarning("Please enter a valid email address");
      return;
    }

    try {
      const response = await apiClient.post("/api/subscribe/", { email });

      if (response.data.status) {
        showSuccess(response.data.message);
        emailInput.value = "";
      } else {
        throw new Error(
          response.data.errors?.email?.[0] || "Subscription failed"
        );
      }
    } catch (error) {
      console.error("Subscription error:", error);
      showError(
        error.response?.data?.message ||
          "Subscription failed. Please try again later."
      );
    }
  }
  hideLoadingState() {
    this.isLoading = false;
    document.getElementById("app").classList.remove("opacity-75");
    const loader = document.getElementById("blog-loader");
    if (loader) loader.classList.add("hidden");
  }
  // Add to BlogDetailPage class
  async fetchProfile() {
    try {
      const response = await apiClient.get("/api/profile/");
      this.profile = response.data;
      this.renderProfileInfo();
      this.renderAuthorBio(this.profile);
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  }
  setupCommentForm() {
    const form = document.getElementById("comment-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
          name: form.querySelector("#name").value,
          email: form.querySelector("#email").value,
          content: form.querySelector("#comment").value,
          blog: this.blogData.id,
        };

        try {
          const response = await apiClient.post("/api/comments/", formData);
          console.log(response.data);
          this.comments = [response.data, ...this.comments];
          this.renderComments();
          form.reset();
          showSuccess(
            "Comment submitted successfully! It will appear after approval."
          );
        } catch (error) {
          console.error("Comment submission error:", error);
          showError(
            "Failed to submit comment: " +
              (error.response?.data?.non_field_errors
[0] || error.message)
          );
        }
      });
    }
  }
  renderProfileInfo() {
    if (!this.profile) return;

    // Update author name
    const authorName = document.querySelector(".author-bio .text-xl");
    if (authorName) authorName.textContent = this.profile.name;

    // Update author bio
    const authorBio = document.querySelector(".author-bio p");
    if (authorBio) authorBio.textContent = this.profile.bio;

    // Update author image
    const authorImg = document.querySelector(".author-bio .bg-gray-200");
    if (authorImg && this.profile.profile_image_url) {
      authorImg.style.backgroundImage = `url(${this.profile.profile_image_url})`;
      authorImg.classList.add("bg-cover", "bg-center");
    }
  }

  renderAuthorBio(profile) {
    // if (!this.profile) return;
    // Find the container element where the author bio should be rendered.
    const container = document.getElementById("author-bio-container");
    if (!container) {
      console.error(
        "No container element with ID 'author-bio-container' found."
      );
      return;
    }

    // Use a placeholder if a certain field is missing.
    const imageUrl =
      profile.profile_image_url || "https://via.placeholder.com/150";
    const name = profile.name || "John Doe";
    const bio =
      profile.bio ||
      "Senior Full-Stack Developer with over 10 years of experience building scalable web applications. Passionate about Python, Django, and performance optimization.";
    document.getElementById("author-image").src = imageUrl;
    document.getElementById("author-bio-name").textContent = name;
    document.getElementById("author-bio-description").textContent = bio;
    this.renderSocialLinks();
  }

  async fetchRelatedArticles() {
    if (!this.blogData.categories || this.blogData.categories.length === 0)
      return;

    try {
      const category = this.blogData.categories[0].slug;
      const response = await apiClient.get(
        `/api/blog/?category=${category}&exclude=${this.blogData.id}`
      );
      console.log("Related articles response:", response.data);
      this.relatedArticles = response.data.data;
      this.renderRelatedArticles();
    } catch (error) {
      console.error("Failed to load related articles", error);
    }
  }
  renderSocialLinks() {
    if (!this.profile) return;

    // Twitter
    const twitterLink = document.querySelector(
      ".author-bio-social-link-twitter"
    );
    if (twitterLink && this.profile.twitter_url) {
      twitterLink.href = this.profile.twitter_url;
    } else if (twitterLink) {
      twitterLink.style.display = "none";
    }

    // LinkedIn
    const linkedinLink = document.querySelector(
      ".author-bio-social-link-linkedin"
    );
    if (linkedinLink && this.profile.linkedin_url) {
      linkedinLink.href = this.profile.linkedin_url;
    } else if (linkedinLink) {
      linkedinLink.style.display = "none";
    }

    // GitHub
    const githubLink = document.querySelector(".author-bio-social-link-github");
    if (githubLink && this.profile.github_url) {
      githubLink.href = this.profile.github_url;
    } else if (githubLink) {
      githubLink.style.display = "none";
    }

    // YouTube (optional – hide if no URL is provided)
    const youtubeLink = document.querySelector(
      ".author-bio-social-link-youtube"
    );
    if (youtubeLink) {
      if (this.profile.youtube_url) {
        youtubeLink.href = this.profile.youtube_url;
      } else {
        youtubeLink.style.display = "none";
      }
    }
  }
  renderComment(comment, depth = 0) {
  const indent = depth * 32; // 32px indent per level
  return `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6" style="margin-left: ${indent}px">
      <div class="flex items-start mb-4">
        <div class="flex-shrink-0 mr-4">
          <div class="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" style="background-image: url('/public/profile.png'); background-size: cover;"></div>
        </div>
        <div>
          <h4 class="font-bold text-gray-800 dark:text-white">${comment.author.name}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ${new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })} at ${new Date(comment.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          </p>
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-4">${comment.content}</p>
      <button 
        class="reply-button text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-medium"
        data-comment-id="${comment.id}"
      >
        <i class="fa-regular fa-comment-dots mr-1"></i> Reply
      </button>
      
      <div class="reply-form-container mt-4 hidden" id="reply-form-${comment.id}">
        <form class="reply-form" data-parent-id="${comment.id}">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reply</label>
            <textarea
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm"
          >
            Post Reply
          </button>
        </form>
      </div>
      
      ${comment.replies.length > 0 ? 
        comment.replies.map(reply => this.renderComment(reply, depth + 1)).join('') : ''}
    </div>
  `;
}
renderComments() {
  const container = document.getElementById("comments-container");
  if (!container || !this.comments) return;
  
  if (this.comments.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 dark:text-gray-400">
        <i class="fa-regular fa-comment-dots mr-1"></i> No comments yet.
      </div>
    `;
    return;
  }
  
  container.innerHTML = this.comments.map(comment => 
    this.renderComment(comment)).join('');
  
  // Setup reply buttons
  document.querySelectorAll('.reply-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const commentId = e.target.dataset.commentId;
      const formContainer = document.getElementById(`reply-form-${commentId}`);
      formContainer.classList.toggle('hidden');
    });
  });
  
  // Setup reply forms
  document.querySelectorAll('.reply-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const parentId = form.dataset.parentId;
      const inputs = form.querySelectorAll('input, textarea');
      
      const formData = {
        name: inputs[0].value,
        email: inputs[1].value,
        content: inputs[2].value,
        blog: this.blogData.id,
        parent: parentId
      };

      try {
        const response = await apiClient.post("/api/comments/", formData);
        this.comments = this.buildCommentTree([response.data, ...this.flatComments]);
        this.renderComments();
        showSuccess("Reply submitted successfully!");
        form.reset();
      } catch (error) {
        showError("Failed to submit reply: " + (error.response?.data || error.message));
      }
    });
  });
}
  renderRelatedArticles() {
    const container = document.getElementById("related-articles-container");
    if (!container || !this.relatedArticles) return;

    container.innerHTML = this.relatedArticles
      .map(
        (article) => `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition-transform hover:-translate-y-2">
      <div class="h-48 bg-gray-200 dark:bg-gray-700 border-2 border-dashed">
        ${
          article.featured_image_url
            ? `<img src="${article.featured_image_url}" alt="${article.title}" class="w-full h-full object-cover">`
            : ""
        }
      </div>
      <div class="p-6">
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span class="mr-4">${article.publishDate}</span>
          <span><i class="fa-regular fa-clock mr-1"></i> ${Math.ceil(
            article.content.split(/\s+/).length / 200
          )} min read</span>
        </div>
        <h4 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
          ${article.title}
        </h4>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          ${article.excerpt || article.content.substring(0, 100) + "..."}
        </p>
        <a href="#blog-detail/${
          article.slug
        }" class="inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
          Read more
          <i class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    </div>
  `
      )
      .join("");
  }
  setupSocialSharing() {
    const pageUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.blogData.title);

    document.querySelector(
      "[data-share-twitter]"
    ).href = `https://twitter.com/share?url=${pageUrl}&text=${title}`;

    document.querySelector(
      "[data-share-linkedin]"
    ).href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;

    // Add similar for other platforms
  }
  setupNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        try {
          await apiClient.post("/api/subscribe/", { email });
          alert("Subscription successful! Please check your email to confirm.");
        } catch (error) {
          showError(
            "Subscription failed: " +
              (error.response?.data?.message || error.message)
          );
        }
      });
    }
  }
async fetchComments() {
  try {
    const response = await apiClient.get(
      `/api/comments/?content_type=blog&object_id=${this.blogData.id}`
    );
    this.flatComments = response.data.data || [];
    this.comments = this.buildCommentTree(this.flatComments);
    this.renderComments();
  } catch (error) {
    console.error("Failed to load comments", error);
  }
}

buildCommentTree(comments) {
  const map = {};
  const tree = [];

  comments.forEach(comment => {
    map[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach(comment => {
    if (comment.parent && map[comment.parent]) {
      map[comment.parent].replies.push(map[comment.id]);
    } else {
      tree.push(map[comment.id]);
    }
  });

  return tree;
}

  async fetchBlogData() {
    try {
      const response = await apiClient.get(
        `/api/blog-detail/${this.blogSlug}/`
      );
      if (response.data) {
        this.blogData = response.data;
        // Calculate read time based on word count
        const wordCount = this.blogData.content.split(/\s+/).length;
        this.blogData.readTime = Math.ceil(wordCount / 200); // 200 wpm reading speed
      } else {
        throw new Error("Blog data not found");
      }
    } catch (error) {
      console.error("Blog fetch error:", error);
      throw new Error("Failed to load blog details");
    }
  }

  renderBlogDetails() {
    if (!this.blogData) return;

    // Update hero section
    const statusBadge = document.getElementById("blog-status");
    if (statusBadge) {
      statusBadge.textContent =
        this.blogData.status === "published" ? "Published" : "Draft";
    }

    const titleEl = document.getElementById("blog-title");
    if (titleEl) titleEl.textContent = this.blogData.title;

    const heroDesc = document.getElementById("blog-hero-description");
    if (heroDesc)
      heroDesc.textContent =
        this.blogData.excerpt ||
        this.blogData.content.substring(0, 150) + "...";

    // Update featured image
    const featuredImg = document.getElementById("blog-featured-image");
    if (featuredImg) {
      if (this.blogData.featured_image_url) {
        featuredImg.src = this.blogData.featured_image_url;
        featuredImg.classList.remove("hidden");
        featuredImg.alt = this.blogData.title;
        // Hide placeholder
        const placeholder = featuredImg.previousElementSibling;
        if (placeholder && placeholder.classList.contains("bg-gray-200")) {
          placeholder.classList.add("hidden");
        }
      }
    }

    // Update date and views
    const publishedDate = document.getElementById("blog-published-date");
    if (publishedDate) {
      publishedDate.textContent = this.formatDate(
        this.blogData.published_date || this.blogData.created_at
      );
    }

    const viewsEl = document.getElementById("blog-views");
    if (viewsEl) {
      viewsEl.innerHTML = `<i class="fa-regular fa-eye mr-1"></i> ${this.blogData.views} views`;
    }

    // Update read time
    const readTimeEl = document.querySelector(".fa-clock").parentNode;
    if (readTimeEl) {
      readTimeEl.innerHTML = `<i class="fa-regular fa-clock mr-1"></i> ${this.blogData.readTime} min read`;
    }

    // Update excerpt section
    const excerptContainer = document.querySelector(".bg-blue-50 p");
    if (excerptContainer) {
      excerptContainer.textContent =
        this.blogData.excerpt ||
        `"${this.blogData.content.substring(0, 120)}..."`;
    }

    // Update main content
    const contentContainer = document.getElementById("blog-content");
    if (contentContainer) {
      contentContainer.innerHTML = this.blogData.content;
    }

    // Update tags (if implemented in backend)
    if (this.blogData.tags && this.blogData.tags.length > 0) {
      const tagsContainer = document.querySelector(
        ".flex.flex-wrap.gap-3.mt-12.mb-8"
      );
      if (tagsContainer) {
        tagsContainer.innerHTML = "";
        this.blogData.tags.forEach((tag) => {
          const tagEl = document.createElement("a");
          tagEl.href = "#";
          tagEl.className =
            "px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700";
          tagEl.textContent = `#${tag}`;
          tagsContainer.appendChild(tagEl);
        });
      }
    }

    // Update author info (if implemented in backend)
    if (this.blogData.author) {
      const authorName = document.querySelector(".author-bio .text-xl");
      if (authorName) authorName.textContent = this.blogData.author.name;

      const authorBio = document.querySelector(".author-bio p");
      if (authorBio) authorBio.textContent = this.blogData.author.bio;

      const authorImg = document.querySelector(".author-bio .bg-gray-200");
      if (authorImg && this.blogData.author.image_url) {
        authorImg.style.backgroundImage = `url(${this.blogData.author.image_url})`;
        authorImg.classList.add("bg-cover", "bg-center");
      }
    }

    if (this.blogData.categories && this.blogData.categories.length > 0) {
      const tagsContainer = document.querySelector(
        ".flex.flex-wrap.gap-3.mt-12.mb-8"
      );
      if (tagsContainer) {
        tagsContainer.innerHTML = "";
        this.blogData.categories.forEach((category) => {
          const tagEl = document.createElement("a");
          tagEl.href = `#${category.slug}`;
          tagEl.className =
            "px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700";
          tagEl.textContent = `#${category.name}`;
          tagsContainer.appendChild(tagEl);
        });
      }
    }

    // Update hero author info
    if (this.blogData.author) {
      const authorName = document.querySelector(".author-bio .text-xl");
      if (authorName) authorName.textContent = this.blogData.author.name;

      const authorBio = document.querySelector(".author-bio p");
      if (authorBio) authorBio.textContent = this.blogData.author.bio;

      const authorImg = document.querySelector(".author-bio .bg-gray-200");
      if (authorImg && this.blogData.author.image_url) {
        authorImg.style.backgroundImage = `url(${this.blogData.author.image_url})`;
        authorImg.classList.add("bg-cover", "bg-center");
      }
    }

    // Update hero author name
    const heroAuthor = document.querySelector(".text-left > .font-medium");
    if (heroAuthor && this.blogData.author) {
      heroAuthor.textContent = this.blogData.author.name;
    }

    // Update hero author image
    const heroAuthorImg = document.querySelector(".flex-shrink-0 .bg-gray-200");
    if (heroAuthorImg && this.blogData.author?.image_url) {
      heroAuthorImg.style.backgroundImage = `url(${this.blogData.author.image_url})`;
      heroAuthorImg.classList.add("bg-cover", "bg-center");
      heroAuthorImg.classList.remove(
        "bg-gray-200",
        "border-2",
        "border-dashed"
      );
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  updatePageMetadata() {
    // Update page title
    document.title = `${this.blogData.title} | Blog`;

    // Update Open Graph metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = this.blogData.title;

    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription)
      ogDescription.content =
        this.blogData.excerpt || this.blogData.content.substring(0, 150);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && this.blogData.featured_image_url) {
      ogImage.content = this.blogData.featured_image_url;
    }
  }

  addAnimations() {
    const elementsToAnimate = [
      document.getElementById("blog-hero-section"),
      document.getElementById("blog-featured-image"),
      document.getElementById("blog-content-container"),
      document.querySelector(".author-bio"),
    ];

    elementsToAnimate.forEach((el, index) => {
      if (el) {
        el.classList.add("opacity-0", "translate-y-6");
        setTimeout(() => {
          el.classList.add("transition-all", "duration-500", "ease-out");
          el.classList.remove("opacity-0", "translate-y-6");
        }, 100 + index * 150);
      }
    });
  }

  handleError(error) {
    console.error("BlogDetail error:", error);

    const errorContainer = document.getElementById("blog-error");
    const contentContainer = document.getElementById("blog-content-container");

    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-800 mb-2">Failed to load blog post</h3>
          <p class="text-red-600 mb-4">${
            error.message || "Please try again later"
          }</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            <i class="fa-solid fa-rotate-right mr-2"></i> Reload Page
          </button>
        </div>
      `;
      errorContainer.classList.remove("hidden");
    }

    if (contentContainer) {
      contentContainer.classList.add("hidden");
    }
  }
}

// Initialize the blog detail page
const blogDetailPage = new BlogDetailPage();
blogDetailPage.init();
