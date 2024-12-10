document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.getElementById('loginPage');
    const profilePage = document.getElementById('profilePage');
    const startBtn = document.getElementById('startBtn');
    const passwordInput = document.getElementById('passwordInput');

    // 优化后的打字动画效果
    function typeText() {
        passwordInput.value = '';
        const text = 'J_jChen';
        let index = 0;
        
        // 添加闪烁的光标效果
        passwordInput.style.borderRight = '2px solid #007AFF';
        
        // 延迟开始打字，给用户一个准备的时间
        setTimeout(() => {
            const typing = setInterval(() => {
                if (index < text.length) {
                    passwordInput.value += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typing);
                    // 动画结束后移除光标
                    setTimeout(() => {
                        passwordInput.style.borderRight = 'none';
                    }, 500);
                }
            }, 150); // 调��打字速度
        }, 800); // 调整开始延迟
    }

    // 页面加载后启动打字动画
    typeText();

    // 添加项目的函数
    function addProject(title, description, imageUrl) {
        const projectsContainer = document.querySelector('.projects-container');
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${title}">
            </div>
            <h2 class="project-title">${title}</h2>
            <p class="project-description">${description}</p>
        `;
        
        projectsContainer.appendChild(projectCard);
        // 添加动画效果
        setTimeout(() => {
            projectCard.classList.add('slide-in');
        }, 100);
    }

    // 开始按钮点击事件
    startBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        
        if (password !== 'CHENJ') {
            alert('请输入正确的名称');
            return;
        }

        loginPage.style.display = 'none';
        profilePage.classList.remove('hidden');
        profilePage.classList.add('fade-in');
    });

    // 监听滚动事件，添加动画效果
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // 修改轮播图功能，添加拖动支持
    function initializeSliders() {
        document.querySelectorAll('.slider').forEach(slider => {
            const container = slider.querySelector('.slider-container');
            const dots = slider.querySelectorAll('.dot');
            const prevBtn = slider.querySelector('.prev');
            const nextBtn = slider.querySelector('.next');
            let currentSlide = 0;
            const totalSlides = dots.length;

            // 拖动相关变量
            let isDragging = false;
            let startPos = 0;
            let currentTranslate = 0;
            let prevTranslate = 0;
            let animationID = 0;
            let currentIndex = 0;

            // 禁用默认图片拖动
            container.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
            });

            // 触摸事件
            container.addEventListener('touchstart', touchStart);
            container.addEventListener('touchmove', touchMove);
            container.addEventListener('touchend', touchEnd);

            // 鼠标事件
            container.addEventListener('mousedown', touchStart);
            container.addEventListener('mousemove', touchMove);
            container.addEventListener('mouseup', touchEnd);
            container.addEventListener('mouseleave', touchEnd);

            function touchStart(event) {
                isDragging = true;
                startPos = getPositionX(event);
                animationID = requestAnimationFrame(animation);
                container.style.cursor = 'grabbing';
                container.style.transition = 'none';
            }

            function touchMove(event) {
                if (!isDragging) return;
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }

            function touchEnd() {
                isDragging = false;
                cancelAnimationFrame(animationID);
                container.style.cursor = 'grab';
                
                const movedBy = currentTranslate - prevTranslate;
                
                // 确定是否需要切换到下一张/上一张
                if (Math.abs(movedBy) > 100) { // 拖动超过100px时切换
                    if (movedBy < 0) {
                        currentSlide = Math.min(currentSlide + 1, totalSlides - 1);
                    } else {
                        currentSlide = Math.max(currentSlide - 1, 0);
                    }
                }
                
                updateSlider();
            }

            function getPositionX(event) {
                return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            }

            function animation() {
                if (isDragging) {
                    setSliderPosition();
                    requestAnimationFrame(animation);
                }
            }

            function setSliderPosition() {
                // 限制拖动范围
                const maxTranslate = -(totalSlides - 1) * slider.offsetWidth;
                currentTranslate = Math.max(Math.min(currentTranslate, 0), maxTranslate);
                container.style.transform = `translateX(${currentTranslate}px)`;
            }

            function updateSlider() {
                container.style.transition = 'transform 0.3s ease-out';
                container.style.transform = `translateX(-${currentSlide * 33.333}%)`;
                prevTranslate = -currentSlide * slider.offsetWidth;
                currentTranslate = prevTranslate;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            // 原有的点击和自动播放功能保持不变
            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            }

            // 点击圆点切换图片
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    updateSlider();
                });
            });

            // 点击按钮切换图片
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);

            // 自动轮播
            let autoSlide = setInterval(nextSlide, 5000);

            // 鼠标悬停时暂停自动轮播
            slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
            slider.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextSlide, 5000);
            });
        });
    }

    // 在页面加载完成后初始化轮播图
    initializeSliders();

    // 在 DOMContentLoaded 事件处理函数中添加图片预览功能
    function initializeImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        // 为所有项目图片添加点击事件
        document.querySelectorAll('.slider-container img').forEach(img => {
            img.addEventListener('click', (e) => {
                // 阻止事件冒泡，避免触发轮播图的点击事件
                e.stopPropagation();
                
                // 设置预览图片的源
                previewImage.src = img.src;
                
                // 显示预览层
                imagePreview.classList.remove('hidden');
                setTimeout(() => {
                    imagePreview.classList.add('active');
                }, 10);
                
                // 禁用页面滚动
                document.body.style.overflow = 'hidden';
            });
        });
        
        // 点击预览层关闭预览
        imagePreview.addEventListener('click', () => {
            imagePreview.classList.remove('active');
            setTimeout(() => {
                imagePreview.classList.add('hidden');
                // 恢复页面滚动
                document.body.style.overflow = '';
            }, 300);
        });
        
        // 阻止预览图片的点击事件冒泡
        previewImage.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 在页面加载完成后初始化图片预览功能
    initializeImagePreview();
}); 