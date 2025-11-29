import { Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function LandingPage() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Tab Switch Monitoring',
      description: 'Automatic tracking and termination when students exceed tab switch limits'
    },
    {
      icon: ClockIcon,
      title: 'Timed Exams',
      description: 'Set exam durations with automatic submission when time expires'
    },
    {
      icon: DocumentTextIcon,
      title: 'Multiple Choice Questions',
      description: 'Create quizzes with 4-option MCQs with automatic scoring'
    },
    {
      icon: ChartBarIcon,
      title: 'Detailed Reports',
      description: 'View comprehensive attempt reports with scores and feedback'
    },
    {
      icon: AcademicCapIcon,
      title: 'Role-Based Access',
      description: 'Separate portals for administrators and students'
    },
    {
      icon: UserGroupIcon,
      title: 'Attempt Management',
      description: 'Track all student attempts with timestamps and performance metrics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-6">
            <ShieldCheckIcon className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Quiz<span className="text-indigo-600">Proctor</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure, proctored online quizzes with intelligent tab-switch monitoring, 
            automated scoring, and comprehensive reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login/admin" className="btn btn-primary btn-lg">
              Admin Portal
            </Link>
            <Link to="/login/student" className="btn btn-secondary btn-lg">
              Student Portal
            </Link>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
            <span>New admin? <Link to="/register/admin" className="text-indigo-600 hover:underline font-medium">Register here</Link></span>
            <span className="hidden sm:inline">•</span>
            <span>New student? <Link to="/register/student" className="text-indigo-600 hover:underline font-medium">Sign up</Link></span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-gray-600 text-lg">Everything you need for secure online assessments</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Flow */}
            <div className="card bg-indigo-50 border-indigo-200">
              <div className="card-body">
                <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 mr-2" />
                  For Admins
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-indigo-600 mr-2">1.</span>
                    <span>Register with admin code and login</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-indigo-600 mr-2">2.</span>
                    <span>Create quizzes with multiple choice questions</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-indigo-600 mr-2">3.</span>
                    <span>Set exam duration and tab switch limits</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-indigo-600 mr-2">4.</span>
                    <span>Share quiz URL with students</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-indigo-600 mr-2">5.</span>
                    <span>Monitor attempts and review reports</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Student Flow */}
            <div className="card bg-purple-50 border-purple-200">
              <div className="card-body">
                <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2" />
                  For Students
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-2">1.</span>
                    <span>Register and login to your account</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-2">2.</span>
                    <span>Access quiz via instructor-provided link</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-2">3.</span>
                    <span>Review quiz details and start when ready</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-2">4.</span>
                    <span>Complete quiz within time limit</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-2">5.</span>
                    <span>View your scores and feedback</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} QuizProctor. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Secure online quiz proctoring platform</p>
        </div>
      </footer>
    </div>
  );
}
