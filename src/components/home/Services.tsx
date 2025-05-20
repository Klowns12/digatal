import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getFeaturedItems } from '../../services/featuredItemsService';

// Base service categories data
const serviceCategories = [
	{
		id: 'elearning',
		title: 'Customized e-Learning',
		titleThai: 'จัดทำหลักสูตรในรูปแบบที่ลูกค้าต้องการ',
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `e-Learning Project ${i + 1}`,
			price: 25.0,
			rating: i % 2 === 0 ? 4 : 5,
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
			price: 25.0,
			rating: 4,
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
			price: 25.0,
			rating: 4,
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
			price: 25.0,
			rating: 4,
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
			price: 25.0,
			rating: 4,
			featured: false // Will be updated from service
		}))
	}
];

const Services = () => {
	const { t, i18n } = useTranslation();
	const isThaiLanguage = i18n.language === 'th';
	
	// Add state for processed categories
	const [categories, setCategories] = useState(serviceCategories);
	
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

	const renderRating = (rating: number) => {
		return (
			<div className="flex">
				{[...Array(5)].map((_, i) => (
					<span
						key={i}
						className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
					>
						★
					</span>
				))}
			</div>
		);
	};

	return (
		<section className="py-10 bg-white">
			<div className="container mx-auto px-4">
				{categories.map((category, categoryIndex) => (
					<motion.div
						key={category.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
						className={`mb-16 last:mb-0 ${categoryIndex === 0 ? 'mt-0' : ''}`}
					>
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-1">
								{category.title}
							</h2>
							<h3 className="text-lg text-gray-700">
								{category.titleThai}
							</h3>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
										<div className="flex items-center mb-4">
											{renderRating(item.rating)}
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-900 font-medium">฿{item.price.toFixed(2)}</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>

						<div className="text-center mt-8">
							<Link
								to={`/category/${category.id}`}
								className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							>
								{isThaiLanguage ? 'อ่านเพิ่มเติม' : 'Read More'}
							</Link>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
};

export default Services;