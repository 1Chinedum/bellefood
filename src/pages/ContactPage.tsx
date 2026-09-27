import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Contact Belle Food
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have a question about large catering, event food orders, delivery zones, or need customer support? We’re always here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">Restaurant Flagship Hub</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">Direct Order Hotline</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              +234 800 235 5336 / +234 809 111 2233
            </p>
            <span className="text-[11px] text-stone-400 block">Available daily 8:00 AM – 10:30 PM</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">Email Inquiries</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              hello@bellefood.ng / catering@bellefood.ng
            </p>
          </div>

          <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-md space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Opening Hours</span>
            </div>
            <div className="text-sm font-bold">Monday – Sunday: 8:00 AM – 10:30 PM</div>
            <p className="text-[11px] text-stone-400">Kitchen takes last online order at 10:15 PM</p>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs">
          <h2 className="text-lg font-extrabold text-stone-900 mb-1">Send Us a Message</h2>
          <p className="text-xs text-stone-400 mb-6">Our guest relations manager typically replies within 1 hour.</p>

          {sent && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your message has been received. We will respond promptly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fola Davies"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fola@example.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Catering for 50 people / Delivery query"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can Belle Food serve you best?"
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
