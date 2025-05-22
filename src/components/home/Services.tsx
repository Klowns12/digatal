import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import { getFeaturedItems } from '../../services/featuredItemsService';
import { getVideosByCategory, getFeaturedInCategoryVideos } from '../../services/videoService';
import YouTubeEmbed, { getYoutubeId } from '../videos/YouTubeEmbed';

// Base service categories data with descriptions added
const serviceCategories = [
	{
		id: 'elearning',
		title: 'Customized e-Learning',
		titleThai: 'จัดทำหลักสูตรในรูปแบบที่ลูกค้าต้องการ',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `e-Learning Project ${i + 1}`,
			description: `Short description for e-Learning project ${i + 1} showcasing key features and benefits.`,
			featured: false // Will be updated from service
		}))
	},
	{
		id: 'video',
		title: 'Video Production',
		titleThai: 'ออกกองถ่ายทำในรูปแบบวิดีโอ',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `Video Project ${i + 1}`,
			description: `Brief overview of video project ${i + 1} highlighting production quality and educational value.`,
			featured: false // Will be updated from service
		}))
	},
	{
		id: '360',
		title: '360 Matterport and 360 Virtual Tour & Training',
		titleThai: '360 Matterport และ Virtual Tour & Training แบบ 360°',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `360° Tour ${i + 1}`,
			description: `Immersive 360° virtual experience ${i + 1} allowing viewers to explore environments interactively.`,
			featured: false // Will be updated from service
		}))
	},
	{
		id: 'lms',
		title: 'Learning Management System (LMS)',
		titleThai: 'ระบบจัดการการเรียนรู้ (LMS)',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `LMS Solution ${i + 1}`,
			description: `Comprehensive learning management solution ${i + 1} with analytics and user tracking capabilities.`,
			featured: false // Will be updated from service
		}))
	},
	{
		id: 'web',
		title: 'Web Design & Development',
		titleThai: 'ออกแบบและพัฒนาเว็บไซต์',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `Web Project ${i + 1}`,
			description: `Responsive, user-friendly website ${i + 1} designed to meet specific client requirements and goals.`,
			featured: false // Will be updated from service
		}))
	}
];

const Services = () => {
	const { t, i18n } = useTranslation();
	const location = useLocation();
	const isThaiLanguage = i18n.language === 'th';
	const [categories, setCategories] = useState(serviceCategories);
	const [categoryVideos, setCategoryVideos] = useState<Record<string, any[]>>({});
	const [selectedVideo, setSelectedVideo] = useState<{id: string, url: string, title: string} | null>(null);

	// Listen for changes and update when featured items change
	useEffect(() => {
		// Function to update categories with featured items
		const updateFeaturedItems = () => {
			const featuredItems = getFeaturedItems();
			
			setCategories(prev => prev.map(category => {
				const featuredIds = featuredItems[category.id] || [];
				
				return {
					...category,
					items: category.items.map(item => ({
						...item,
						featured: featuredIds.includes(item.id)
					}))
				};
			}));
		};
		
		// Initial update
		updateFeaturedItems();
		
		// Listen for changes from admin
		const handleFeaturedChange = () => updateFeaturedItems();
		window.addEventListener('featured-items-changed', handleFeaturedChange);
		
		return () => {
			window.removeEventListener('featured-items-changed', handleFeaturedChange);
		};
	}, []);

	// โหลดวิดีโอที่ถูกเลือกแสดงในหน้าหลัก
	useEffect(() => {
		const loadFeaturedVideos = () => {
			serviceCategories.forEach(category => {
				const videos = getFeaturedInCategoryVideos(category.id);
				setCategoryVideos(prev => ({
					...prev,
					[category.id]: videos
				}));
			});
		};

		loadFeaturedVideos();
		window.addEventListener('video-featured-changed', loadFeaturedVideos);
		
		return () => {
			window.removeEventListener('video-featured-changed', loadFeaturedVideos);
		};
	}, []);

	// Scroll to section on hash change
	useEffect(() => {
		const hash = location.hash.replace('#', '');
		if (hash) {
			setTimeout(() => {
				const element = document.getElementById(hash);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		}
	}, [location.hash]);

	const openVideoModal = (video: any) => {
		if (video.youtubeUrl) {
			setSelectedVideo({
				id: video.id,
				url: video.youtubeUrl,
				title: isThaiLanguage && video.titleThai ? video.titleThai : video.title
			});
		}
	};

	const closeVideoModal = () => {
		setSelectedVideo(null);
	};

	return (
		<section className="py-10 bg-white">
			<div className="container mx-auto px-4">
				{categories.map((category, categoryIndex) => (
					<motion.div
						key={category.id}
						id={category.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
						className={`mb-16 last:mb-0 ${categoryIndex === 0 ? 'mt-0' : ''}`}
					>
						<div className="text-center mb-8 flex items-center">
							<div className="flex-grow h-px bg-gray-200"></div>
							<div className="mx-4">
								<h2 className="text-2xl font-bold text-gray-900 mb-1">
									{category.title}
								</h2>
								<h3 className="text-lg text-gray-700">
									{category.titleThai}
								</h3>
							</div>
							<div className="flex-grow h-px bg-gray-200"></div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
							{/* แสดงวิดีโอที่ถูกเลือก */}
							{categoryVideos[category.id]?.map((video, index) => (
								<motion.div
									key={`video-${video.id}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src={video.thumbnail}
											alt={video.title}
											className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
										/>
										{video.youtubeUrl && (
											<div 
												className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 cursor-pointer transition-all"
												onClick={() => openVideoModal(video)}
											>
												<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
													<Play size={24} className="text-blue-600 ml-1" />
												</div>
											</div>
										)}
									</div>
									<div className="p-4">
										<h3 className="text-lg font-semibold mb-2 text-gray-900">
											{isThaiLanguage ? video.titleThai : video.title}
										</h3>
										<p className="text-sm text-gray-600 line-clamp-3">
											{isThaiLanguage ? video.descriptionThai : video.description}
										</p>
									</div>
								</motion.div>
							))}
							
							{/* แสดงรายการอื่นๆ */}
							{category.items.filter(item => item.featured).map((item, index) => (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
								>
									<div className="relative h-48 overflow-hidden">
										<img
											src="https://images.pexels.com/photos/3943904/pexels-photo-3943904.jpeg?auto=compress&cs=tinysrgb&w=600"
											alt={item.title}
											className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
										/>
									</div>
									<div className="p-4">
										<h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
										{/* Replacing rating and price with description */}
										<p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
									</div>
								</motion.div>
							))}
						</div>

						<div className="text-left mt-8">
							<Link
								to={`/category/${category.id}`}
								className="inline-block px-3 py-1 text-orange-500 border-2 border-orange-500 font-medium rounded-full hover:bg-orange-500 hover:text-white transition-colors"
							>
								{isThaiLanguage ? 'อ่านเพิ่มเติม' : 'Read More'}
							</Link>
						</div>
					</motion.div>
				))}
			</div>

			{/* Video Modal Popup */}
			<AnimatePresence>
				{selectedVideo && (
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 md:p-8"
					>
						<motion.div 
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden relative"
						>
							<div className="p-4 bg-gray-100 flex justify-between items-center">
								<h3 className="font-medium text-lg line-clamp-1">{selectedVideo.title}</h3>
								<button 
									onClick={closeVideoModal}
									className="p-1 hover:bg-gray-200 rounded-full transition-colors"
								>
									<X size={24} />
								</button>
							</div>
							
							<div className="relative">
								<YouTubeEmbed 
									videoId={getYoutubeId(selectedVideo.url)} 
									title={selectedVideo.title}
									className="aspect-video" 
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
};

export default Services;