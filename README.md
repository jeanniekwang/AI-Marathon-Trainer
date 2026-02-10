# AI Marathon Trainer

Create personalized training plans based on your own data!

## Overview

AI Marathon Trainer is a web-based application that generates customized running training plans based on your personal metrics and goals. Whether you're training for a 5K, 10K, half marathon, or full marathon, this tool creates a week-by-week training schedule tailored to your needs.

## Features

- **Personalized Input**: Enter your gender, age, target distance, training days per week, and training duration
- **Smart Defaults**: Automatic recommendations based on race distance:
  - 5K/10K: 3 training days/week, 1 month duration
  - Half Marathon: 3 training days/week, 2 months duration
  - Marathon: 4 training days/week, 4 months duration
- **Progressive Training**: Plans include base building, build phase, peak training, and taper periods
- **Varied Workouts**: Mix of easy runs, tempo runs, interval training, and long runs
- **Printable Plans**: Print your training plan for easy reference

## How to Use

1. Open `index.html` in your web browser
2. Fill in your personal information:
   - Select your gender
   - Enter your age
   - Choose your target race distance
   - Specify how many days per week you want to train
   - Set your training duration in months
3. Click "Generate Training Plan"
4. Review your personalized weekly training schedule
5. Print your plan using the "Print Plan" button if desired

## Training Plan Structure

The generated plan is divided into four phases:
- **Base Building** (first 40% of training): Build aerobic foundation
- **Build Phase** (40-75% of training): Increase mileage and intensity
- **Peak Training** (75-90% of training): Maximum training load
- **Taper** (final 1-2 weeks): Reduce volume before race day

## File Structure

- `index.html` - Main web page with the input form
- `styles.css` - Styling for the website
- `script.js` - JavaScript logic for generating training plans

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server required - runs entirely in the browser

## Local Development

Simply open `index.html` in your web browser. No build process or dependencies required.

## Future Enhancements

Potential improvements:
- Integration with AI for more advanced plan customization
- Pace calculator based on recent race times
- Training log to track completed workouts
- Export to calendar applications
- Mobile app version
